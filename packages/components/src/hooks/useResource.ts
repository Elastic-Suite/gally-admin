import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'

import {
  IError,
  IHydraMember,
  IMainContext,
  IResource,
  IResourceOperations,
  Method,
  contentTypeHeader,
  getApiUrl,
  getResource,
  updatePropertiesAccordingToPath,
} from '@elastic-suite/gally-admin-shared'

import { selectApi, useAppSelector } from '../store'

import { useApiFetch } from './useApi'

export function useResource(
  resourceName: string,
  mainContext: IMainContext = IMainContext.GRID
): IResource {
  const api = useAppSelector(selectApi)
  const { pathname } = useRouter()
  return useMemo(() => {
    const resource = getResource(api, resourceName)
    return {
      ...resource,
      supportedProperty:
        resource?.supportedProperty instanceof Array
          ? resource?.supportedProperty.map((field) =>
              updatePropertiesAccordingToPath(field, pathname, mainContext)
            )
          : resource?.supportedProperty
          ? [
              updatePropertiesAccordingToPath(
                resource.supportedProperty,
                pathname,
                mainContext
              ),
            ]
          : resource?.supportedProperty,
    }
  }, [api, pathname, mainContext, resourceName])
}

export function useResourceOperations<T extends IHydraMember>(
  resource: IResource
): IResourceOperations<T> {
  const { supportedOperation } = resource
  const fetchApi = useApiFetch()
  const apiUrl = getApiUrl(resource.url)

  const update = useCallback(
    (id: string | number, item: Partial<T>): Promise<T | IError> =>
      fetchApi<T>(`${apiUrl}/${id}`, undefined, {
        body: JSON.stringify(item),
        method: Method.PATCH,
        headers: { [contentTypeHeader]: 'application/merge-patch+json' },
      }),
    [apiUrl, fetchApi]
  )

  const create = useCallback(
    (item: Omit<T, 'id' | '@id' | '@type'>): Promise<T | IError> =>
      fetchApi(apiUrl, undefined, {
        body: JSON.stringify(item),
        method: Method.POST,
      }),
    [apiUrl, fetchApi]
  )

  const replace = useCallback(
    (item: Partial<T>): Promise<T | IError> =>
      fetchApi(`${apiUrl}/${item.id}`, undefined, {
        body: JSON.stringify(item),
        method: Method.PUT,
      }),
    [apiUrl, fetchApi]
  )

  const remove = useCallback(
    (id: string | number): Promise<T | IError> =>
      fetchApi(`${apiUrl}/${id}`, undefined, {
        method: Method.DELETE,
      }),
    [apiUrl, fetchApi]
  )

  return useMemo(
    () =>
      supportedOperation.reduce<IResourceOperations<T>>((acc, operation) => {
        if (typeof operation['@type'] === 'string') {
          acc.update = update
        } else if (
          operation['@type'] instanceof Array &&
          operation['@type'].length === 2 &&
          typeof operation['@type'][1] === 'string'
        ) {
          if (
            operation['@type'][1].indexOf('//schema.org/CreateAction') !== -1
          ) {
            acc.create = create
          } else if (
            operation['@type'][1].indexOf('//schema.org/ReplaceAction') !== -1
          ) {
            acc.replace = replace
          } else if (
            operation['@type'][1].indexOf('//schema.org/DeleteAction') !== -1
          ) {
            acc.remove = remove
          }
        }
        return acc
      }, {}),
    [create, remove, replace, supportedOperation, update]
  )
}
