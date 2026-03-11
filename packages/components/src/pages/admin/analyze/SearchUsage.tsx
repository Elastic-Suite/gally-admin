import React, {
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import { withAuth, withOptions } from '../../../hocs'
import { breadcrumbContext, catalogContext } from '../../../contexts'
import {
  useFetchApi,
  useFilters,
  useFiltersRedirect,
  useResource,
} from '../../../hooks'
import {
  IHydraMember,
  IHydraResponse,
  ISearchParameters,
  createUTCDateSafe,
} from '@elastic-suite/gally-admin-shared'
import { DoubleDatePicker, PageTitle } from '../../../components'
import { useTranslation } from 'next-i18next'
import KPIGroup from '../../../components/molecules/KPIGroup/KPIGroup'
import CatalogSwitcher from '../../../components/stateful/CatalogSwitcher/CatalogSwitcher'
import { Paper, styled } from '@mui/material'
import {
  IDoubleDatePickerErrors,
  IDoubleDatePickerValues,
} from '../../../components/atoms/form/DoubleDatePickerWithoutError'
import Button from '../../../components/atoms/buttons/Button'
import IonIcon from '../../../components/atoms/IonIcon/IonIcon'
import { TestId, generateTestId } from '../../../utils/testIds'
import { isValid } from 'date-fns'

type IKPI = IHydraMember & {
  id: string | number
}

const pagesSlug = ['analyze', 'search_usage']

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

const excludedKeys = [
  '@id',
  '@type',
  'id',
  'localizedCatalog',
  'startDate',
  'endDate',
]

function AdminAnalyzeSearchUsage(): JSX.Element {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const { t } = useTranslation(['searchUsage', 'api'])

  const resource = useResource('Kpi')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [kpiDateFilter, setKpiDateFilter] = useState<IDoubleDatePickerValues>({
    fromDate: (activeFilters.startDate as string) ?? null,
    toDate: (activeFilters.endDate as string) ?? null,
  })
  const [showError, setShowError] = useState(false)
  const [filtersHaveError, setFiltersHaveError] = useState(false)
  const localizedCatalogContext = useContext(catalogContext)

  const filtersForUrl = useMemo(() => {
    const filters: ISearchParameters = { ...activeFilters }
    // We remove catalog filters from/to URL as they use a context
    // So they do not work easily with the useFiltersRedirect hook
    delete filters.catalog
    delete filters.localizedCatalog
    return filters
  }, [activeFilters])

  const filtersForApi = useMemo(() => {
    const filters: ISearchParameters = { ...activeFilters }
    if (filters?.localizedCatalog) {
      delete filters.catalog
    }
    return filters
  }, [activeFilters])

  const pendingFilters = useMemo(() => {
    const filters: ISearchParameters = {}

    if (localizedCatalogContext?.localizedCatalog?.code) {
      filters.localizedCatalog = localizedCatalogContext.localizedCatalog?.code
    } else if (localizedCatalogContext?.catalog?.code) {
      filters.catalog = localizedCatalogContext.catalog.code
    }

    if (kpiDateFilter.fromDate) {
      const startValue = createUTCDateSafe(new Date(kpiDateFilter.fromDate))
      if (isValid(startValue)) {
        startValue.setUTCHours(0, 0, 0, 0)
        const [startDate] = startValue.toISOString().split('T')
        filters.startDate = startDate
      }
    }

    if (kpiDateFilter.toDate) {
      const endValue = createUTCDateSafe(new Date(kpiDateFilter.toDate))
      if (isValid(endValue)) {
        endValue.setUTCHours(23, 59, 59, 999)
        const [endDate] = endValue.toISOString().split('T')
        filters.endDate = endDate
      }
    }
    return filters
  }, [kpiDateFilter, localizedCatalogContext])

  function onFiltersError(errors: IDoubleDatePickerErrors): void {
    const filtersHaveError = Object.values(errors).some((e) => e)
    setFiltersHaveError(filtersHaveError)
  }

  const filtersHaveChanged = useMemo(() => {
    return Object.fromEntries(
      Object.entries(pendingFilters).filter(
        ([key, value]) => activeFilters[key] !== value
      )
    )
  }, [pendingFilters, activeFilters])

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setShowError(true)

    // Validate form
    if (!formRef.current?.checkValidity()) {
      return
    }

    // Check for custom errors
    if (filtersHaveError) {
      return
    }

    // Apply filters if validation passes
    if (filtersHaveChanged) {
      setActiveFilters(pendingFilters)
    }
  }

  function handleReset(): void {
    // Reset form validation state
    setShowError(false)
    setFiltersHaveError(false)

    // Reset date filter
    setKpiDateFilter({
      fromDate: null,
      toDate: null,
    })
    localizedCatalogContext.setCatalogId(null)
    localizedCatalogContext.setLocalizedCatalogId(-1)

    if (Object.values(activeFilters).length) {
      setActiveFilters({})
    }
  }

  const [{ data: kpiData }] = useFetchApi<IHydraResponse<IKPI>>(
    resource,
    filtersForApi
  )

  const resourcePrefix = useMemo(
    () => resource?.title?.toLowerCase(),
    [resource]
  )
  useFiltersRedirect(0, filtersForUrl, '', true, resourcePrefix)

  const kpiGroups = useMemo(() => {
    if (!kpiData?.['hydra:member']) return []

    return kpiData['hydra:member'].map((kpi) => ({
      id: kpi.id,
      kpis: Object.entries(kpi)
        .filter(([label, _]) => !excludedKeys.includes(label))
        .map(([label, value], index) => ({
          id: `${kpi.id}_${index}`,
          componentId: label,
          label: t(label),
          value: value ?? '',
        })),
    }))
  }, [kpiData, t])

  return (
    <>
      <PageTitle title={t('searchUsage')} sx={{ marginBottom: '32px' }} />
      <StyledPaper>
        <StyledForm
          ref={formRef}
          onSubmit={handleSubmit}
          data-testid={generateTestId(TestId.KPI_FILTERS)}
          noValidate
        >
          <CatalogSwitcher />
          <StyledContainer>
            <DoubleDatePicker
              componentId="period"
              label={t('period')}
              value={kpiDateFilter}
              onChange={setKpiDateFilter}
              onError={onFiltersError}
              showError={showError}
            />
          </StyledContainer>
          <StyledButtonContainer>
            <Button
              type="submit"
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
              onClick={handleReset}
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
      {kpiGroups?.length > 0
        ? kpiGroups.map(({ id, kpis }) => (
            <KPIGroup animated key={id} kpis={kpis} />
          ))
        : null}
    </>
  )
}

export default withAuth()(withOptions(AdminAnalyzeSearchUsage))
