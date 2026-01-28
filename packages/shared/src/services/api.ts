import {
  apiUrl,
  authErrorCodes,
  authHeader,
  contentDispositionHeader,
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
  IParam,
  IResource,
  IResponseError,
  ISearchParameters,
  LoadStatus,
} from '../types'

import { fetchJson, fetchRaw } from './fetch'
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
  const optionsHeaders = (options.headers as Record<string, string>) || {}
  const shouldSetContentType = !(
    contentTypeHeader in optionsHeaders && !optionsHeaders[contentTypeHeader]
  )

  // Filter out empty content type from options headers
  // This is useful for multipart/form-data (file upload) that let the browser handle
  // The content-type and the file boundaries automatically
  const filteredOptionsHeaders = Object.fromEntries(
    Object.entries(optionsHeaders).filter(([_, value]) => Boolean(value))
  )

  const headers: Record<string, string> = {
    [languageHeader]: language,
    ...(shouldSetContentType && { [contentTypeHeader]: 'application/ld+json' }),
    ...filteredOptionsHeaders,
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

/**
 * Extracts the filename from a Content-Disposition header.
 */
function extractFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) {
    return null
  }

  const filenameMatch = contentDisposition.match(
    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  )
  if (!filenameMatch?.[1]) {
    return null
  }

  return filenameMatch[1].replace(/['"]/g, '')
}

export function fetchApiFile(
  resource: IResource | string,
  secure = true
): Promise<{
  content: string
  contentType: string | null
  filename: string
  status: LoadStatus
}> {
  const token = storageGet(tokenStorageKey)
  const headers: Record<string, string> = {}
  if (secure && token) {
    headers[authHeader] = `Bearer ${token}`
  }

  const apiUrl =
    typeof resource === 'string' ? getApiUrl(resource) : getApiUrl(resource.url)

  return fetchRaw(apiUrl, { headers }).then(({ content, response }) => {
    if (authErrorCodes.includes(response.status)) {
      storageRemove(tokenStorageKey)
      throw new AuthError('Unauthorized/Forbidden')
    }
    return {
      content,
      contentType: response.headers.get(contentTypeHeader),
      filename: extractFilename(response.headers.get(contentDispositionHeader)),
      status:
        response.status !== 200 ? LoadStatus.FAILED : LoadStatus.SUCCEEDED,
    }
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

function formatFilterValue(value: IParam): boolean | number | string {
  return value instanceof Date ? value.toISOString().split('T')[0] : value
}

function formatRangeFilterKeys(key: string, value: IParam[]): string[] {
  const baseKey = getFieldName(key)
  return [
    value[0] instanceof Date ? `${baseKey}[after]` : `${baseKey}[gte]`,
    value[1] instanceof Date ? `${baseKey}[before]` : `${baseKey}[lte]`,
  ]
}

function formatRangeFilterKeyValues(
  key: string,
  value: IParam[]
): [string, boolean | number | string][] {
  const filterKeys = formatRangeFilterKeys(key, value)
  const rangeFilterKeyValues: [string, boolean | number | string][] = []
  if (value[0] !== '') {
    rangeFilterKeyValues.push([filterKeys[0], formatFilterValue(value[0])])
  }
  if (value[1] !== '') {
    rangeFilterKeyValues.push([filterKeys[1], formatFilterValue(value[1])])
  }
  return rangeFilterKeyValues
}

export function getApiFilters(
  filters: ISearchParameters = {}
): ISearchParameters {
  return Object.fromEntries(
    Object.entries(filters).reduce<[string, IParam | IParam[]][]>(
      (acc, [key, value]) => {
        if (key.endsWith('[between]')) {
          acc.push(...formatRangeFilterKeyValues(key, value as IParam[]))
        } else {
          acc.push([key, formatFilterValue(value as IParam)])
        }
        return acc
      },
      []
    )
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
