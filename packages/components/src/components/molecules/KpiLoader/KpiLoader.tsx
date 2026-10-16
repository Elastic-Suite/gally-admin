import React, { ReactNode, useContext, useEffect, useMemo } from 'react'
import {
  IHydraResponse,
  ISearchParameters,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'

import { kpiFiltersContext } from '../../../contexts'
import { useFetchApi, useResource } from '../../../hooks'

export interface IKPI {
  '@id'?: string
  '@type'?: string
  id: string | number
  valueFormat?: Record<string, string>
}

export interface IKpiScope {
  localizedCatalog: string
  startDate: string | null
  endDate: string | null
}

export interface IKpiWithHelp extends IKPI, IKpiScope {
  help: string | null
}

export type IKpiSessions = IKpiWithHelp & {
  sessionsWithSearchCount: number
  sessionsWithoutSearchCount: number
  sessionsWithSearchPercentage: number
  sessionsWithoutSearchPercentage: number
}

export type IKpiConversionRate = IKpiWithHelp & {
  globalConversionRate: number
  conversionRateWithSearch: number
  conversionRateWithoutSearch: number
}

export interface IKpiLoaderResult<T extends IKPI = IKPI> {
  kpis: T[]
  status: LoadStatus
  error?: Error
}

export interface IKpiTermItem {
  term: string
  valueFormat?: Record<string, string>
}

export type IKpiTermList<T extends IKpiTermItem> = IKpiWithHelp & {
  terms: T[]
}

export type IKpiZeroResultTerm = IKpiTermItem & {
  sessionCount: number
  visitorCount: number
}

export type IKpiPopularSearchTerm = IKpiTermItem & {
  sessionCount: number
  visitorCount: number
  averageResultCount: number
  conversionRate: number
}

export function readTermList<T extends IKpiTermItem>(
  kpis: IKpiTermList<T>[]
): Pick<IKpiTermList<T>, 'help' | 'terms'> {
  const [first] = kpis
  return first ?? { help: null, terms: [] }
}

interface IKpiLoaderProps<T extends IKPI = IKPI> {
  resourceName?: string
  // Path for a KPI that is not declared as a resource, e.g. 'kpi/search_sessions'.
  endpoint?: string
  searchParameters?: ISearchParameters
  children: (result: IKpiLoaderResult<T>) => ReactNode
  onLoad?: (result: IKpiLoaderResult<T>) => void
}

function KpiLoader<T extends IKPI = IKPI>({
  resourceName,
  endpoint,
  searchParameters,
  children,
  onLoad,
}: IKpiLoaderProps<T>): JSX.Element {
  const resource = useResource(resourceName)
  const { apiFilters, trackLoading } = useContext(kpiFiltersContext)
  const parameters = useMemo(
    () =>
      searchParameters ? { ...apiFilters, ...searchParameters } : apiFilters,
    [apiFilters, searchParameters]
  )

  // Without a url, useFetchApi would call the API root.
  const hasUrl = Boolean(endpoint ?? resource?.url)
  const [{ data, status, error }] = useFetchApi<IHydraResponse<T>>(
    endpoint ?? resource,
    parameters,
    undefined,
    undefined,
    hasUrl
  )

  const result = useMemo<IKpiLoaderResult<T>>(
    () => ({ kpis: data?.['hydra:member'] ?? [], status, error }),
    [data, status, error]
  )

  useEffect(() => {
    onLoad?.(result)
  }, [onLoad, result])

  const isLoading = status === LoadStatus.LOADING
  useEffect(
    () => (isLoading ? trackLoading() : undefined),
    [isLoading, trackLoading]
  )

  return <>{children(result)}</>
}

export default KpiLoader
