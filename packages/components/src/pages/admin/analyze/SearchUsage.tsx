import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { withAuth, withOptions } from '../../../hocs'
import { breadcrumbContext, catalogContext } from '../../../contexts'
import { useFetchApi, useFilters, useResource } from '../../../hooks'
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

const StyledButton = styled(Button)(() => ({
  marginTop: '25px',
}))

function AdminAnalyseSearchUsage(): JSX.Element {
  const router = useRouter()

  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const { t } = useTranslation(['searchUsage', 'api'])

  const resource = useResource('Kpi')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [kpiDateFilter, setKpiDateFilter] = useState<IDoubleDatePickerValues>({
    fromDate: null,
    toDate: null,
  })
  const [showError, setShowError] = useState(false)
  const [filtersHaveError, setFiltersHaveError] = useState(false)
  const localizedCatalogContext = useContext(catalogContext)

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

  function applyFilters(): void {
    setShowError(true)
    if (!filtersHaveError && pendingFilters !== activeFilters) {
      setActiveFilters(pendingFilters)
    }
  }

  const [{ data: kpiData }] = useFetchApi<IHydraResponse<IKPI>>(
    resource,
    activeFilters
  )

  const excludedKeys = [
    '@id',
    '@type',
    'id',
    'localizedCatalog',
    'startDate',
    'endDate',
  ]
  let kpiIndex = 0
  const kpiGroups = kpiData?.['hydra:member'].map((kpi) => ({
    id: kpi.id,
    kpis: Object.entries(kpi)
      .filter(([label, _]) => !excludedKeys.includes(label))
      .map(([label, value]) => ({
        id: `${kpi.id}_${kpiIndex++}`,
        componentId: label,
        label: t(label),
        value: value ?? '',
      })),
  }))

  return (
    <>
      <PageTitle title={t('searchUsage')} sx={{ marginBottom: '32px' }} />
      <StyledPaper data-testid={generateTestId(TestId.KPI_FILTERS)}>
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
        <StyledButton
          type="submit"
          endIcon={<IonIcon name="checkmark-done-outline" />}
          data-testid={generateTestId(
            TestId.FILTER_APPLY_BUTTON,
            'searchUsage'
          )}
          onClick={applyFilters}
        >
          {t('filters.apply', { ns: 'api' })}
        </StyledButton>
      </StyledPaper>
      {kpiGroups?.length > 0
        ? kpiGroups.map(({ id, kpis }) => (
            <KPIGroup animated key={id} kpis={kpis} />
          ))
        : null}
    </>
  )
}

export default withAuth()(withOptions(AdminAnalyseSearchUsage))
