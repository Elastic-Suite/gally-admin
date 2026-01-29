import {
  currentPage,
  defaultPageSize,
  pageSize,
  rangeSeparator,
  searchParameter,
  usePagination,
} from '../constants'
import { ISearchParameters } from '../types'

import { removeEmptyParameters } from './api'

function formatDateParameterForUrl(param: Date): string {
  // We force the dd/MM/yyyy HH:mm:ss to we can guess a param in url is a date without knowing anything else
  const date = param.toLocaleDateString('en-GB').replace(/-/g, '/')
  const time = param.toLocaleTimeString('en-GB', { hour12: false })
  return `${date} ${time}`
}

function getRangeParameterFromUrl(param: string): (string | Date)[] {
  return param.split(rangeSeparator).map((v) => {
    // Date parameters always follow the dd/MM/yyyy HH:mm:ss regardless of locale
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2}):(\d{2})$/
    const match = v.match(datePattern)

    if (match) {
      const [, day, month, year, hours, minutes, seconds] = match
      // Create date from dd/MM/yyyy HH:mm:ss format
      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
        Number(seconds)
      )
    }

    return v
  })
}

function formatRangeParameterForUrl(
  value: ISearchParameters[keyof ISearchParameters]
): string {
  if (Array.isArray(value)) {
    return value
      .map((v) =>
        v instanceof Date ? formatDateParameterForUrl(v) : String(v ?? '')
      )
      .join(rangeSeparator)
  }
  return String(value)
}

function isValidRange(value: (string | number | Date)[]): boolean {
  return value.some((v) => v !== '' && v !== null)
}

export function getUrl(
  urlParam: string | URL,
  searchParameters: ISearchParameters = {}
): URL {
  const url: URL = urlParam instanceof URL ? urlParam : new URL(urlParam)

  Object.entries(searchParameters).forEach(([key, value]) => {
    if (key.endsWith('[between]')) {
      value = value as (string | number | Date)[]
      if (isValidRange(value as (string | number | Date)[])) {
        url.searchParams.append(key, formatRangeParameterForUrl(value))
      }
    } else if (value instanceof Array) {
      value.forEach((value) => url.searchParams.append(key, String(value)))
    } else {
      url.searchParams.append(key, String(value))
    }
  })

  return url
}

export function clearParameters(url: URL): URL {
  ;[...url.searchParams.entries()].forEach(([key]) =>
    url.searchParams.delete(key)
  )
  return url
}

export function getListParameters(
  page: number | false = 0,
  searchParameters: ISearchParameters = {},
  searchValue = ''
): ISearchParameters {
  if (typeof page === 'number') {
    return removeEmptyParameters({
      ...searchParameters,
      [currentPage]: page === 0 ? '' : page, // If page=0, remove parameter from URL
      [searchParameter]: searchValue,
    })
  }
  return removeEmptyParameters({
    ...searchParameters,
    [searchParameter]: searchValue,
  })
}

export function getListApiParameters(
  page: number | false = 0,
  rowsPerPage: number = defaultPageSize,
  searchParameters: ISearchParameters = {},
  searchValue = ''
): ISearchParameters {
  if (typeof page === 'number') {
    return removeEmptyParameters({
      ...searchParameters,
      [currentPage]: page + 1,
      [usePagination]: true,
      [pageSize]: rowsPerPage,
      [searchParameter]: searchValue,
    })
  }
  return removeEmptyParameters({
    ...searchParameters,
    [usePagination]: false,
    [searchParameter]: searchValue,
  })
}

export function getRouterUrl(path: string): URL {
  return new URL(`${window.location.origin}${path}`)
}

export function getRouterPath(path: string): string {
  const url = getRouterUrl(path)
  return clearParameters(url).pathname
}

export function getAppUrl(
  path: string,
  page: number | false = 0,
  activeFilters?: ISearchParameters,
  searchValue?: string
): URL {
  const parameters = getListParameters(page, activeFilters, searchValue)
  const url = getRouterUrl(path)
  return getUrl(clearParameters(url), parameters)
}

export function getParametersFromUrl(url: URL): ISearchParameters {
  return Object.fromEntries(
    [...url.searchParams.entries()].reduce((acc, [key, value]) => {
      if (key.endsWith('[between]')) {
        acc.push([key, getRangeParameterFromUrl(value)])
      } else if (key.endsWith('[]')) {
        const existingValue = acc.find(([accKey]) => accKey === key)?.[1]
        if (existingValue) {
          existingValue.push(value)
        } else {
          acc.push([key, [value]])
        }
      } else {
        acc.push([key, value])
      }
      return acc
    }, [])
  )
}

export function getPageParameter(parameters: ISearchParameters): number {
  const pageEntry = Object.entries(parameters).find(
    ([key]) => key === currentPage
  )
  return Number(pageEntry?.[1] ?? 0)
}

export function getSearchParameter(parameters: ISearchParameters): string {
  const pageEntry = Object.entries(parameters).find(
    ([key]) => key === searchParameter
  )
  return String(pageEntry?.[1] ?? '')
}
