import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { withAuth, withOptions } from '../../../hocs'
import { breadcrumbContext } from '../../../contexts'
import { LoadStatus } from '@elastic-suite/gally-admin-shared'
import { PageTitle } from '../../../components'
import { useTranslation } from 'next-i18next'
import KPIGroup, {
  getKpiGroupItems,
} from '../../../components/molecules/KPIGroup/KPIGroup'
import KpiLoader, {
  IKpiLoaderResult,
} from '../../../components/molecules/KpiLoader/KpiLoader'
import EmptyWarning from '../../../components/molecules/KpiSearchUsage/EmptyWarning'
import Filters from '../../../components/molecules/KpiSearchUsage/Filters'
import IndicatorCard, {
  indicatorLayout,
} from '../../../components/molecules/KpiSearchUsage/IndicatorLayout'
import { StyledIndicatorGrid } from '../../../components/molecules/KpiSearchUsage/KpiSearchUsage.styled'
import { isFirstLoad } from '../../../services'
import ReservedSpace from '../../../components/molecules/KpiSearchUsage/ReservedSpace'
import KpiFiltersProvider from '../../../components/stateful-providers/KpiFiltersProvider/KpiFiltersProvider'

const pagesSlug = ['analyze', 'search_usage']

const kpiCountersHeight = 373 // three rows of counters

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
      <EmptyWarning isKpiValuesEmpty={isKpiValuesEmpty} />
      <Filters />
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
