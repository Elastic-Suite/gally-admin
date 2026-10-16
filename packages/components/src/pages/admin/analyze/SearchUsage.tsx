import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import { withAuth, withOptions } from '../../../hocs'
import { breadcrumbContext, kpiFiltersContext } from '../../../contexts'
import { LoadStatus } from '@elastic-suite/gally-admin-shared'
import { DoubleDatePicker, PageTitle } from '../../../components'
import { Trans, useTranslation } from 'next-i18next'
import KPIGroup, {
  getKpiGroupItems,
} from '../../../components/molecules/KPIGroup/KPIGroup'
import KpiLoader, {
  IKpiConversionRate,
  IKpiLoaderResult,
  IKpiPopularSearchTerm,
  IKpiSessions,
  IKpiTermItem,
  IKpiTermList,
  IKpiZeroResultTerm,
  readTermList,
} from '../../../components/molecules/KpiLoader/KpiLoader'
import PieChart, {
  pieChartHeight,
} from '../../../components/atoms/charts/PieChart'
import BarChart from '../../../components/atoms/charts/BarChart'
import ReadOnlyTable from '../../../components/atoms/ReadOnlyTable/ReadOnlyTable'
import { IRow } from '../../../components/atoms/ReadOnlyTable/ReadOnlyTable.styled'
import PopIn from '../../../components/atoms/modals/PopIn'
import { Title } from '../../../components/molecules/SearchTermsTable/SearchTermsTable.styled'
import InfoTooltip from '../../../components/atoms/form/InfoTooltip'
import KpiFiltersProvider from '../../../components/stateful-providers/KpiFiltersProvider/KpiFiltersProvider'
import CatalogSwitcher from '../../../components/stateful/CatalogSwitcher/CatalogSwitcher'
import {
  CircularProgress,
  Paper,
  Theme,
  TooltipProps,
  styled,
} from '@mui/material'
import Button from '../../../components/atoms/buttons/Button'
import IonIcon from '../../../components/atoms/IonIcon/IonIcon'
import Alert from '../../../components/atoms/Alert/Alert'
import { TestId, generateTestId, joinItemIds } from '../../../utils/testIds'
import { formatHelpText } from '../../../utils/helpText'

const pagesSlug = ['analyze', 'search_usage']

// Layout path of the current widget, e.g. "charts|sessions". Keeps test ids
// unique when the same widget appears twice.
const indicatorInstanceContext = createContext('')

function useWidgetId(kind: string): string {
  const instance = useContext(indicatorInstanceContext)
  return joinItemIds(kind, instance)
}

export const StyledPaper = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  boxShadow: 'none',
  columnGap: theme.spacing(3),
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  rowGap: theme.spacing(6),
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(6),
}))

const StyledContainer = styled('div')(() => ({
  marginBottom: '8px',
}))

const StyledButtonContainer = styled('div')(() => ({
  marginTop: '25px',
}))

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  columnGap: theme.spacing(3),
  rowGap: theme.spacing(6),
  alignItems: 'flex-start',
  width: '100%',
}))

type IndicatorSize = 'full' | 'twoThirds' | 'half' | 'third'

const indicatorColumns: Record<IndicatorSize, number> = {
  full: 6,
  twoThirds: 4,
  half: 3,
  third: 2,
}

const StyledIndicatorGrid = styled('div', {
  shouldForwardProp: (prop) => prop !== 'level',
})<{ level: 'top' | 'cards' | 'inCard' }>(({ theme, level }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
  gap: theme.spacing(level === 'inCard' ? 4 : 3),
  marginTop: level === 'top' ? theme.spacing(6) : 0,
}))

function getIndicatorSpan(
  theme: Theme,
  size: IndicatorSize
): Record<string, unknown> {
  return {
    gridColumn: `span ${indicatorColumns[size]}`,
    minWidth: 0,
    [theme.breakpoints.down('md')]: {
      gridColumn: '1 / -1',
    },
  }
}

const StyledTermsTableTitle = styled(Title)({ marginTop: 0 })

// A nested node: it only takes its place in the parent's grid.
const StyledIndicatorCell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: IndicatorSize }>(({ theme, size }) => getIndicatorSpan(theme, size))

const StyledIndicatorCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: IndicatorSize }>(({ theme, size }) => ({
  ...getIndicatorSpan(theme, size),
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  boxShadow: 'none',
  padding: theme.spacing(2),
}))

const kpiCountersHeight = 373 // three rows of counters
const termsTableHeight = 69 + 10 * 49 // header on two lines, 10 rows
// Right-side tables: open below or above, not over the table title.
const termsTableTooltipFallbacks: TooltipProps['placement'][] = [
  'bottom',
  'top',
]

function isFirstLoad({ kpis, status }: IKpiLoaderResult): boolean {
  return (
    kpis.length === 0 &&
    (status === LoadStatus.IDLE || status === LoadStatus.LOADING)
  )
}

function hasNoData({ kpis, status }: IKpiLoaderResult): boolean {
  return status === LoadStatus.SUCCEEDED && kpis.length === 0
}

interface IReservedSpaceProps {
  isLoading: boolean
  minHeight: number
  children: ReactNode
}

function ReservedSpace({
  isLoading,
  minHeight,
  children,
}: IReservedSpaceProps): JSX.Element {
  return <div style={isLoading ? { minHeight } : undefined}>{children}</div>
}

const sessionsChartColors = {
  withSearch: '#2C19CD',
  withoutSearch: '#ED7465',
}

const conversionRateChartColors = {
  global: '#E57373',
  withSearch: '#1A1AFF',
  withoutSearch: '#FFCDD2',
}

const StyledTableActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}))

const StyledNoData = styled('p')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(3, 2),
  border: '1px solid #E2E6F3',
  borderRadius: theme.spacing(1),
  textAlign: 'center',
  fontSize: '14px',
  fontFamily: 'var(--gally-font)',
  color: theme.palette.colors.neutral['600'],
}))

const thesaurusGridUrl = '/admin/search/thesaurus/grid'

const allTermsParameters = { pageSize: 1000 }

const allTermsPopinStyles = {
  paper: { width: 760, maxWidth: '90vw', height: '80vh' },
}

const StyledPopinLoader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
})

interface ISearchUsageEmptyWarningProps {
  isKpiValuesEmpty: boolean
}

function SearchUsageEmptyWarning({
  isKpiValuesEmpty,
}: ISearchUsageEmptyWarningProps): JSX.Element {
  const [showWarning, setShowWarning] = useState(true)

  if (!showWarning || !isKpiValuesEmpty) {
    return null
  }

  return (
    <Alert
      variant="warning"
      style={{ marginBottom: 0 }}
      onShut={(): void => setShowWarning(false)}
    >
      <Trans
        i18nKey="kpiValuesEmpty.warning"
        ns="searchUsage"
        components={{
          lnk: (
            <a
              href="https://github.com/Elastic-Suite/gally-ts-sdk/wiki"
              target="_blank"
              rel="noreferrer"
            >
              {/* content injected by Trans */}
            </a>
          ),
        }}
      />
    </Alert>
  )
}

function SearchUsageFilters(): JSX.Element {
  const { t } = useTranslation(['searchUsage', 'api'])
  const kpiFilters = useContext(kpiFiltersContext)

  return (
    <StyledPaper>
      <StyledForm
        ref={kpiFilters.formRef}
        onSubmit={kpiFilters.handleSubmit}
        data-testid={generateTestId(TestId.KPI_FILTERS)}
        noValidate
      >
        <CatalogSwitcher />
        <StyledContainer>
          <DoubleDatePicker
            componentId="period"
            label={t('period')}
            value={kpiFilters.dateFilter}
            onChange={kpiFilters.handleDateFilterChange}
            onError={kpiFilters.handleFiltersError}
            showError={kpiFilters.showError}
          />
        </StyledContainer>
        <StyledButtonContainer>
          <Button
            type="submit"
            disabled={kpiFilters.isRefreshDisabled}
            endIcon={<IonIcon name="checkmark-done-outline" />}
            data-testid={generateTestId(
              TestId.FILTER_APPLY_BUTTON,
              'searchUsage'
            )}
          >
            {t('filters.apply', { ns: 'api' })}
          </Button>
          <Button
            display="tertiary"
            disabled={kpiFilters.isRefreshDisabled}
            onClick={kpiFilters.handleReset}
            endIcon={<IonIcon name="reload-outline" />}
            data-testid={generateTestId(
              TestId.FILTER_CLEAR_BUTTON,
              'searchUsage'
            )}
          >
            {t('filters.clearAll', { ns: 'api' })}
          </Button>
        </StyledButtonContainer>
      </StyledForm>
    </StyledPaper>
  )
}

function SearchUsageSessionsChart(): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const widgetId = useWidgetId('sessions')

  return (
    <KpiLoader<IKpiSessions> endpoint="kpi/search_sessions">
      {(result): JSX.Element => {
        const [kpi] = result.kpis
        const isEmpty =
          hasNoData(result) ||
          (kpi &&
            kpi.sessionsWithSearchCount + kpi.sessionsWithoutSearchCount === 0)
        return (
          <PieChart
            componentId={widgetId}
            label={t('sessionsChart')}
            infoTooltip={formatHelpText(kpi?.help)}
            emptyMessage={isEmpty ? t('noData') : undefined}
            data={[
              {
                label: t('sessionsWithSearch'),
                value: kpi?.sessionsWithSearchPercentage ?? 0,
                color: sessionsChartColors.withSearch,
              },
              {
                label: t('sessionsWithoutSearch'),
                value: kpi?.sessionsWithoutSearchPercentage ?? 0,
                color: sessionsChartColors.withoutSearch,
              },
            ]}
          />
        )
      }}
    </KpiLoader>
  )
}

function SearchUsageConversionRateChart(): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const widgetId = useWidgetId('conversionRate')

  return (
    <KpiLoader<IKpiConversionRate> endpoint="kpi/conversion_rate">
      {(result): JSX.Element => {
        const [kpi] = result.kpis
        // No session count in this response: all rates at 0 means no data.
        const isEmpty =
          hasNoData(result) ||
          (kpi &&
            kpi.globalConversionRate === 0 &&
            kpi.conversionRateWithSearch === 0 &&
            kpi.conversionRateWithoutSearch === 0)
        return (
          <BarChart
            componentId={widgetId}
            label={t('conversionRateChart')}
            infoTooltip={formatHelpText(kpi?.help)}
            emptyMessage={isEmpty ? t('noData') : undefined}
            height={pieChartHeight}
            data={[
              {
                label: t('globalConversionRate'),
                value: kpi?.globalConversionRate ?? 0,
                color: conversionRateChartColors.global,
              },
              {
                label: t('conversionRateWithSearch'),
                value: kpi?.conversionRateWithSearch ?? 0,
                color: conversionRateChartColors.withSearch,
              },
              {
                label: t('conversionRateWithoutSearch'),
                value: kpi?.conversionRateWithoutSearch ?? 0,
                color: conversionRateChartColors.withoutSearch,
              },
            ]}
          />
        )
      }}
    </KpiLoader>
  )
}

interface IKpiTermsTableProps<T extends IKpiTermItem> {
  componentId: string
  rows: T[]
  columns: (keyof T & string)[]
}

function KpiTermsTable<T extends IKpiTermItem>({
  componentId,
  rows,
  columns,
}: IKpiTermsTableProps<T>): JSX.Element {
  const { t } = useTranslation('searchUsage')

  const header: IRow = {
    cells: columns.map((column) => ({ id: column, value: t(column) })),
  }
  const body: IRow[] = rows.map((row, index) => ({
    id: `row-${index}`,
    cells: columns.map((column) => {
      const value = row[column] as string | number
      return {
        id: `${column}-${index}`,
        value: row.valueFormat?.[column] === 'percentage' ? `${value}%` : value,
      }
    }),
  }))

  return (
    <ReadOnlyTable
      componentId={componentId}
      header={header}
      body={body}
      fullWidth
    />
  )
}

interface IKpiAllTermsPopInProps<T extends IKpiTermItem> {
  componentId: string
  endpoint: string
  title: string
  buttonLabel: string
  columns: (keyof T & string)[]
}

function KpiAllTermsPopIn<T extends IKpiTermItem>({
  componentId,
  endpoint,
  title,
  buttonLabel,
  columns,
}: IKpiAllTermsPopInProps<T>): JSX.Element {
  const allTermsId = joinItemIds(componentId, 'all')

  return (
    <PopIn
      componentId={allTermsId}
      position="center"
      titlePopIn={title}
      styles={allTermsPopinStyles}
      triggerElement={
        <Button
          display="secondary"
          data-testid={generateTestId(TestId.KPI_SEE_ALL_BUTTON, componentId)}
        >
          {buttonLabel}
        </Button>
      }
    >
      <KpiLoader<IKpiTermList<T>>
        endpoint={endpoint}
        searchParameters={allTermsParameters}
      >
        {({ kpis, status }): JSX.Element =>
          status === LoadStatus.LOADING && kpis.length === 0 ? (
            <StyledPopinLoader
              data-testid={generateTestId(
                TestId.KPI_ALL_TERMS_LOADER,
                componentId
              )}
            >
              <CircularProgress color="inherit" size="25px" />
            </StyledPopinLoader>
          ) : (
            <KpiTermsTable
              componentId={allTermsId}
              rows={readTermList(kpis).terms}
              columns={columns}
            />
          )
        }
      </KpiLoader>
    </PopIn>
  )
}

interface ISearchUsageTermsTableProps<T extends IKpiTermItem> {
  componentId: string
  endpoint: string
  title: string
  seeAllLabel: string
  columns: (keyof T & string)[]
  children?: ReactNode
}

function SearchUsageTermsTable<T extends IKpiTermItem>({
  componentId,
  endpoint,
  title,
  seeAllLabel,
  columns,
  children,
}: ISearchUsageTermsTableProps<T>): JSX.Element {
  const { t } = useTranslation('searchUsage')

  return (
    <div data-testid={generateTestId(TestId.KPI_TERMS_TABLE, componentId)}>
      <KpiLoader<IKpiTermList<T>> endpoint={endpoint}>
        {(result): JSX.Element => {
          const { help, terms } = readTermList(result.kpis)
          const isEmpty =
            result.status === LoadStatus.SUCCEEDED && terms.length === 0
          const helpContent = formatHelpText(help)
          return (
            <>
              <StyledTermsTableTitle>
                {title}{' '}
                {helpContent ? (
                  <InfoTooltip
                    componentId={componentId}
                    title={helpContent}
                    fallbackPlacements={termsTableTooltipFallbacks}
                  />
                ) : null}
              </StyledTermsTableTitle>
              <ReservedSpace
                isLoading={isFirstLoad(result)}
                minHeight={termsTableHeight}
              >
                {isEmpty ? (
                  <StyledNoData
                    data-testid={generateTestId(TestId.NO_DATA, componentId)}
                  >
                    {t('noData')}
                  </StyledNoData>
                ) : (
                  <KpiTermsTable
                    componentId={componentId}
                    rows={terms}
                    columns={columns}
                  />
                )}
              </ReservedSpace>
              <StyledTableActions>
                {!isEmpty && (
                  <KpiAllTermsPopIn<T>
                    componentId={componentId}
                    endpoint={endpoint}
                    title={title}
                    buttonLabel={seeAllLabel}
                    columns={columns}
                  />
                )}
                {children}
              </StyledTableActions>
            </>
          )
        }}
      </KpiLoader>
    </div>
  )
}

const zeroResultColumns: (keyof IKpiZeroResultTerm & string)[] = [
  'term',
  'sessionCount',
  'visitorCount',
]

function SearchUsageZeroResultTable(): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const router = useRouter()
  const widgetId = useWidgetId('zeroResult')

  function handleCreateThesaurus(): void {
    router.push(thesaurusGridUrl)
  }

  return (
    <SearchUsageTermsTable<IKpiZeroResultTerm>
      componentId={widgetId}
      endpoint="kpi/zero_result"
      title={t('zeroResultTable')}
      seeAllLabel={t('seeAllZeroResultTerms')}
      columns={zeroResultColumns}
    >
      <Button
        display="secondary"
        onClick={handleCreateThesaurus}
        data-testid={generateTestId(
          TestId.KPI_CREATE_THESAURUS_BUTTON,
          widgetId
        )}
      >
        {t('createThesaurus')}
      </Button>
    </SearchUsageTermsTable>
  )
}

const popularSearchTermsColumns: (keyof IKpiPopularSearchTerm & string)[] = [
  'term',
  'sessionCount',
  'visitorCount',
  'averageResultCount',
  'conversionRate',
]

function SearchUsagePopularSearchTermsTable(): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const widgetId = useWidgetId('popularSearchTerms')

  return (
    <SearchUsageTermsTable<IKpiPopularSearchTerm>
      componentId={widgetId}
      endpoint="kpi/popular_search_terms"
      title={t('popularSearchTermsTable')}
      seeAllLabel={t('seeAllPopularSearchTerms')}
      columns={popularSearchTermsColumns}
    />
  )
}

interface IIndicatorLeaf {
  id: string
  size: IndicatorSize
  Indicator: () => JSX.Element
}

interface IIndicatorGroup {
  id: string
  size: IndicatorSize
  children: IIndicatorNode[]
  cards?: boolean
}

type IIndicatorNode = IIndicatorLeaf | IIndicatorGroup

const indicatorLayout: IIndicatorNode[] = [
  {
    id: 'popularSearchTerms',
    size: 'full',
    Indicator: SearchUsagePopularSearchTermsTable,
  },
  { id: 'zeroResult', size: 'half', Indicator: SearchUsageZeroResultTable },
  {
    id: 'charts',
    size: 'half',
    cards: true,
    children: [
      { id: 'sessions', size: 'full', Indicator: SearchUsageSessionsChart },
      {
        id: 'conversionRate',
        size: 'full',
        Indicator: SearchUsageConversionRateChart,
      },
    ],
  },
]

interface IIndicatorNodeContentProps {
  node: IIndicatorNode
  path: string
}

function IndicatorNodeContent({
  node,
  path,
}: IIndicatorNodeContentProps): JSX.Element {
  if (!('children' in node)) {
    return (
      <indicatorInstanceContext.Provider value={path}>
        <node.Indicator />
      </indicatorInstanceContext.Provider>
    )
  }
  return (
    <StyledIndicatorGrid level="inCard">
      {node.children.map((child) => {
        const childPath = joinItemIds(path, child.id)
        return (
          <StyledIndicatorCell
            key={child.id}
            size={child.size}
            data-testid={generateTestId(TestId.KPI_LAYOUT_CELL, childPath)}
          >
            <IndicatorNodeContent node={child} path={childPath} />
          </StyledIndicatorCell>
        )
      })}
    </StyledIndicatorGrid>
  )
}

function IndicatorCard({
  node,
  path,
}: IIndicatorNodeContentProps): JSX.Element {
  if ('children' in node && node.cards) {
    return (
      <StyledIndicatorCell
        size={node.size}
        data-testid={generateTestId(TestId.KPI_LAYOUT_CELL, path)}
      >
        <StyledIndicatorGrid level="cards">
          {node.children.map((child) => (
            <IndicatorCard
              key={child.id}
              node={child}
              path={joinItemIds(path, child.id)}
            />
          ))}
        </StyledIndicatorGrid>
      </StyledIndicatorCell>
    )
  }
  return (
    <StyledIndicatorCard
      size={node.size}
      data-testid={generateTestId(TestId.KPI_LAYOUT_CARD, path)}
    >
      <IndicatorNodeContent node={node} path={path} />
    </StyledIndicatorCard>
  )
}

function SearchUsageDashboard(): JSX.Element {
  const router = useRouter()

  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const { t } = useTranslation(['searchUsage', 'api'])

  const [isKpiValuesEmpty, setIsKpiValuesEmpty] = useState(false)

  const handleCountersLoad = useCallback(
    ({ kpis, status }: IKpiLoaderResult): void => {
      setIsKpiValuesEmpty(
        status === LoadStatus.SUCCEEDED &&
          kpis.every((kpi) =>
            getKpiGroupItems(kpi, t).every((item) => !item.value)
          )
      )
    },
    [t]
  )

  return (
    <>
      <PageTitle title={t('searchUsage')} sx={{ marginBottom: '32px' }} />
      <SearchUsageEmptyWarning isKpiValuesEmpty={isKpiValuesEmpty} />
      <SearchUsageFilters />
      <KpiLoader endpoint="kpis" onLoad={handleCountersLoad}>
        {(result): JSX.Element => (
          <ReservedSpace
            isLoading={isFirstLoad(result)}
            minHeight={kpiCountersHeight}
          >
            {result.kpis.map((kpi) => (
              <KPIGroup animated key={kpi.id} kpis={getKpiGroupItems(kpi, t)} />
            ))}
          </ReservedSpace>
        )}
      </KpiLoader>
      <StyledIndicatorGrid level="top">
        {indicatorLayout.map((node) => (
          <IndicatorCard key={node.id} node={node} path={node.id} />
        ))}
      </StyledIndicatorGrid>
    </>
  )
}

function AdminAnalyzeSearchUsage(): JSX.Element {
  return (
    <KpiFiltersProvider>
      <SearchUsageDashboard />
    </KpiFiltersProvider>
  )
}

export default withAuth()(withOptions(AdminAnalyzeSearchUsage))
