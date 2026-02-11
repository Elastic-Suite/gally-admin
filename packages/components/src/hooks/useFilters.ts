import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import {
  IResource,
  ISearchParameters,
  getApiFilters,
  getAppUrl,
  getFilterParameters,
  getPageParameter,
  getParametersFromUrl,
  getRouterUrl,
  getSearchParameter,
} from '@elastic-suite/gally-admin-shared'

export function useFiltersRedirect(
  page: number | false = 0,
  activeFilters?: ISearchParameters,
  searchValue?: string,
  active = true,
  prefix?: string
): void {
  const router = useRouter()
  useEffect(() => {
    if (active) {
      const prefixedFilters =
        prefix && activeFilters
          ? Object.fromEntries(
              Object.entries(activeFilters).map(([key, value]) => [
                `${prefix}_${key}`,
                value,
              ])
            )
          : activeFilters

      const url = getAppUrl(
        router.asPath,
        page,
        prefixedFilters,
        searchValue,
        prefix
      )
      if (router.asPath !== url.pathname + url.search) {
        router.push(url.href, undefined, { shallow: true })
      }
    }
  }, [active, activeFilters, page, router, searchValue, prefix])
}

export function usePage(
  prefix?: string
): [number, Dispatch<SetStateAction<number>>] {
  const router = useRouter()
  const [page, setPage] = useState<number>(() => {
    const url = getRouterUrl(router.asPath)
    const parameters = getParametersFromUrl(url, prefix)
    return getPageParameter(parameters)
  })
  return [page, setPage]
}

export function useFilters(
  resource: IResource,
  prefix?: string
): [ISearchParameters, Dispatch<SetStateAction<ISearchParameters>>] {
  const router = useRouter()
  const filterPrefix = prefix ?? resource.title.toLowerCase()
  const [activeFilters, setActiveFilters] = useState<ISearchParameters>(() => {
    const url = getRouterUrl(router.asPath)
    const parameters = getParametersFromUrl(url, filterPrefix)
    const params = getFilterParameters(resource, parameters)
    return params
  })
  return [activeFilters, setActiveFilters]
}

export function useSearch(
  prefix?: string
): [string, Dispatch<SetStateAction<string>>] {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState<string>(() => {
    const url = getRouterUrl(router.asPath)
    const parameters = getParametersFromUrl(url, prefix)
    return getSearchParameter(parameters)
  })
  return [searchValue, setSearchValue]
}

export function useFilterParameters(
  ...filters: ISearchParameters[]
): ISearchParameters {
  return useMemo(
    () => getApiFilters(Object.assign({}, ...filters)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    filters
  )
}
