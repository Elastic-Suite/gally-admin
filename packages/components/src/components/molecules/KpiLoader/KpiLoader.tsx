import React, { ReactNode, useContext, useEffect, useMemo } from 'react'
import {
  IHydraResponse,
  ISearchParameters,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'

import { kpiFiltersContext } from '../../../contexts'
import { useFetchApi, useResource } from '../../../hooks'

// One KPI resource. The API returns it as the single member of a Hydra
// collection, with a generated id.
export interface IKPI {
  '@id'?: string
  '@type'?: string
  id: string | number
  valueFormat?: Record<string, string>
}

// Echo of the filters. The dates are null when the filter was not sent.
export interface IKpiScope {
  localizedCatalog: string
  startDate: string | null
  endDate: string | null
}

// A KPI resource that comes with a help text.
export interface IKpiWithHelp extends IKPI, IKpiScope {
  // Translated by the API, may hold <br />. Null when no text exists.
  help: string | null
}

// GET /kpi/search_sessions - percentages go from 0 to 100.
export type IKpiSessions = IKpiWithHelp & {
  sessionsWithSearchCount: number
  sessionsWithoutSearchCount: number
  sessionsWithSearchPercentage: number
  sessionsWithoutSearchPercentage: number
}

// GET /kpi/conversion_rate - percentages go from 0 to 100.
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

// A row of a term list. Rows are plain objects, with no id.
export interface IKpiTermItem {
  term: string
  valueFormat?: Record<string, string>
}

// GET /kpi/zero_result and /kpi/popular_search_terms: one object holding
// the help text and the terms.
export type IKpiTermList<T extends IKpiTermItem> = IKpiWithHelp & {
  terms: T[]
}

// A term of GET /kpi/zero_result - sorted by sessionCount, highest first.
export type IKpiZeroResultTerm = IKpiTermItem & {
  sessionCount: number
  visitorCount: number
}

// A term of GET /kpi/popular_search_terms - sorted by sessionCount, highest
// first. conversionRate goes from 0 to 100.
export type IKpiPopularSearchTerm = IKpiTermItem & {
  sessionCount: number
  visitorCount: number
  averageResultCount: number
  conversionRate: number
}

// The terms and help text sit in the single member of the collection.
export function readTermList<T extends IKpiTermItem>(
  kpis: IKpiTermList<T>[]
): Pick<IKpiTermList<T>, 'help' | 'terms'> {
  const [first] = kpis
  return first ?? { help: null, terms: [] }
}

interface IKpiLoaderProps<T extends IKPI = IKPI> {
  // API Platform resource name, e.g. 'Kpi', or an endpoint path such as
  // 'kpi/search_sessions' for KPIs that are not declared as a resource.
  resourceName?: string
  endpoint?: string
  // Added to the filters of the context, e.g. { pageSize: 1000 }.
  searchParameters?: ISearchParameters
  children: (result: IKpiLoaderResult<T>) => ReactNode
  onLoad?: (result: IKpiLoaderResult<T>) => void
}

/**
 * Loads one KPI resource or endpoint with the filters of the surrounding
 * kpiFiltersContext, then renders its children with the result.
 */
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

  // A resource the API docs do not declare has no url, and fetching it would
  // call the API root. Wait until there is a path to call.
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

  // Keeps Apply and Clear all disabled until every KPI has loaded.
  const isLoading = status === LoadStatus.LOADING
  useEffect(
    () => (isLoading ? trackLoading() : undefined),
    [isLoading, trackLoading]
  )

  return <>{children(result)}</>
}

export default KpiLoader
