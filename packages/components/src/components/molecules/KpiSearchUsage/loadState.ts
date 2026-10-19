import { LoadStatus } from '@elastic-suite/gally-admin-shared'

import { IKpiLoaderResult } from '../KpiLoader/KpiLoader'

export function isFirstLoad({ kpis, status }: IKpiLoaderResult): boolean {
  return (
    kpis.length === 0 &&
    (status === LoadStatus.IDLE || status === LoadStatus.LOADING)
  )
}

export function hasNoData({ kpis, status }: IKpiLoaderResult): boolean {
  return status === LoadStatus.SUCCEEDED && kpis.length === 0
}
