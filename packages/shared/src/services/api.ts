import {
  apiUrl,
  authErrorCodes,
  authHeader,
  contentTypeHeader,
  defaultPageSize,
  languageHeader,
  tokenStorageKey,
} from '../constants'
import {
  IError,
  IFetch,
  IFetchApi,
  IHydraResponse,
  IResource,
  IResponseError,
  ISearchParameters,
  LoadStatus,
} from '../types'

import { fetchJson } from './fetch'
import { HydraError, getFieldName, isHydraError, isJSonldType } from './hydra'
import { AuthError, isError } from './network'
import { storageGet, storageRemove } from './storage'
import { getListApiParameters, getUrl } from './url'

export class ApiError extends Error {}

export function isApiError<T extends object>(
  json: T | IResponseError
): json is IResponseError {
  return 'code' in json && 'message' in json
}

export function getApiUrl(url = ''): string {
  if (!url.startsWith('http')) {
    if (url.length && !url.startsWith('/')) {
      url = `/${url}`
    }
    url = `${apiUrl}${url}`
  }
  return url
}

export function fetchApi<T extends object>(
  language: string,
  resource: IResource | string,
  searchParameters: ISearchParameters = {},
  options: RequestInit = {},
  secure = true
): Promise<T> {
  const apiUrl =
    typeof resource === 'string' ? getApiUrl(resource) : getApiUrl(resource.url)
  const headers: Record<string, string> = {
    [languageHeader]: language,
    [contentTypeHeader]: 'application/ld+json',
    ...(options.headers as Record<string, string>),
  }
  const token = storageGet(tokenStorageKey)
  if (secure && token) {
    headers[authHeader] = `Bearer ${token}`
  }
  return fetchJson<T>(getUrl(apiUrl, searchParameters).href, {
    ...options,
    headers,
  }).then(({ json, response }) => {
    if (isApiError(json)) {
      if (authErrorCodes.includes(json.code)) {
        storageRemove(tokenStorageKey)
        throw new AuthError(json.message)
      }
      throw new ApiError(json.message)
    } else if (isJSonldType(json) && isHydraError(json)) {
      throw new HydraError(json)
    } else if (authErrorCodes.includes(response.status)) {
      storageRemove(tokenStorageKey)
      throw new AuthError('Unauthorized/Forbidden')
    }
    return json
  })
}

export function removeEmptyParameters(
  searchParameters: ISearchParameters = {}
): ISearchParameters {
  return Object.fromEntries(
    Object.entries(searchParameters).filter(
      ([_, value]) => (value ?? '') !== ''
    )
  )
}

export function getApiFilters(
  filters: ISearchParameters = {}
): ISearchParameters {
  return Object.fromEntries(
    Object.entries(filters).reduce<
      [string, string | number | boolean | (string | number | boolean)[]][]
    >((acc, [key, value]) => {
      if (key.endsWith('[between]')) {
        const baseKey = getFieldName(key)
        value = value as (string | number)[]
        if (value[0] !== '') {
          acc.push([`${baseKey}[gte]`, value[0]])
        }
        if (value[1] !== '') {
          acc.push([`${baseKey}[lte]`, value[1]])
        }
      } else {
        acc.push([key, value])
      }
      return acc
    }, [])
  )
}

/**
 * Check if filters are applied in addition to fixed filters.
 */
export function hasRealFilterApplied(
  searchParameters: ISearchParameters,
  fixedFilters: ISearchParameters
): boolean {
  if (
    (!searchParameters && !fixedFilters) ||
    (!searchParameters && fixedFilters)
  ) {
    return false
  }
  if (searchParameters && !fixedFilters) {
    return true
  }

  const searchParametersCleaned = { ...searchParameters }
  Object.keys(searchParametersCleaned).forEach((key) => {
    if (key in fixedFilters) {
      delete searchParametersCleaned[key]
    }
  })

  return Object.keys(searchParametersCleaned).length > 0
}

export async function fetchApiUsingPagination<T extends object>(
  fetchApi: IFetchApi,
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit,
  rowsPerPage: number = defaultPageSize
): Promise<IFetch<T>> {
  let currentPage = 0
  let newParameters = getListApiParameters(
    currentPage,
    rowsPerPage,
    searchParameters
  )
  const firstResponse: IHydraResponse<T> | IError = await fetchApi<T>(
    resource,
    newParameters,
    options
  )

  if (isError(firstResponse)) {
    return { error: firstResponse.error, status: LoadStatus.FAILED }
  }
  const totalItems = (firstResponse as IHydraResponse<T>)['hydra:totalItems']
  const promises: Promise<IHydraResponse<T> | IError>[] = []
  for (; totalItems > (currentPage + 1) * rowsPerPage; currentPage++) {
    newParameters = getListApiParameters(
      currentPage + 1,
      rowsPerPage,
      searchParameters
    )
    promises.push(fetchApi<T>(resource, newParameters, options))
  }
  const otherResponses = await Promise.all(promises)
  const errors: IError[] = []
  const hydraMemberOtherResponses = otherResponses.flatMap((json) => {
    if (isError(json)) {
      errors.push(json)
      return []
    }
    return (json as IHydraResponse<T>)['hydra:member']
  })
  if (errors.length > 0) {
    return { error: errors[0].error, status: LoadStatus.FAILED }
  }
  ;(firstResponse as IHydraResponse<T>)['hydra:member'].push(
    ...hydraMemberOtherResponses
  )
  return { data: firstResponse, status: LoadStatus.SUCCEEDED }
}
