import {
  Dispatch,
  SetStateAction,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import Router from 'next/router'
import { useTranslation } from 'next-i18next'
import debounce from 'lodash.debounce'
import {
  AuthError,
  IFetch,
  IFetchApi,
  IHydraMember,
  IHydraResponse,
  ILoadResource,
  IResource,
  IResourceEditableOperations,
  ISearchParameters,
  LoadStatus,
  defaultPageSize,
  fetchApi,
  getListApiParameters,
  isError,
  storageRemove,
  tokenStorageKey,
} from '@elastic-suite/gally-admin-shared'

import { useLog } from './useLog'
import { useResourceOperations } from './useResource'

const debounceDelay = 200

export function useApiFetch(secure = true): IFetchApi {
  const { i18n } = useTranslation('common')
  const log = useLog()

  const { t } = useTranslation('alert')

  return useCallback<IFetchApi>(
    async <T extends object>(
      resource: IResource | string,
      searchParameters?: ISearchParameters,
      options?: RequestInit
    ) => {
      try {
        const json = await fetchApi<T>(
          i18n.language,
          resource,
          searchParameters,
          options,
          secure
        )
        return json
      } catch (error) {
        if (secure && error instanceof AuthError) {
          storageRemove(tokenStorageKey)
          Router.push('/login')
          log(t('Expired JWT Token'))
        } else {
          log(error)
        }
        return { error }
      }
    },
    [i18n.language, log, secure, t]
  )
}

export function useFetchApi<T extends object>(
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit,
  secure = true,
  conditions = true
): [IFetch<T>, Dispatch<SetStateAction<T>>, ILoadResource] {
  const fetchApi = useApiFetch(secure)
  const [response, setResponse] = useState<IFetch<T>>({
    status: LoadStatus.IDLE,
  })

  const updateResponse = useCallback((data: SetStateAction<T>): void => {
    setResponse((prevState) => ({
      ...prevState,
      data: data instanceof Function ? data(prevState.data) : data,
    }))
  }, [])

  const load = useCallback(() => {
    if (conditions) {
      setResponse((prevState) => ({
        data: prevState.data,
        status: LoadStatus.LOADING,
      }))
      if (!resource) {
        return setResponse({ data: null, status: LoadStatus.SUCCEEDED })
      }
      fetchApi<T>(resource, searchParameters, options).then((json) => {
        if (isError(json)) {
          setResponse({ error: json.error, status: LoadStatus.FAILED })
        } else {
          setResponse({ data: json, status: LoadStatus.SUCCEEDED })
        }
      })
    }
  }, [conditions, fetchApi, options, resource, searchParameters])

  useLayoutEffect(() => {
    load()
  }, [load])

  return [response, updateResponse, load]
}

export function useApiList<T extends object>(
  resource?: IResource | string,
  page: number | false = 0,
  rowsPerPage: number = defaultPageSize,
  searchParameters?: ISearchParameters,
  searchValue?: string
): [
  IFetch<IHydraResponse<T>> | null,
  Dispatch<SetStateAction<T[]>>?,
  ILoadResource?
] {
  const parameters = useMemo(
    () =>
      getListApiParameters(page, rowsPerPage, searchParameters, searchValue),
    [page, rowsPerPage, searchParameters, searchValue]
  )
  const [response, updateResponse, load] = useFetchApi<IHydraResponse<T>>(
    resource,
    parameters
  )

  const updateList = useCallback(
    (data: SetStateAction<T[]>): void => {
      updateResponse((prevState) => ({
        ...prevState,
        'hydra:member':
          data instanceof Function ? data(prevState['hydra:member']) : data,
      }))
    },
    [updateResponse]
  )

  return [response, updateList, load]
}

export function useApiEditableList<T extends IHydraMember>(
  resource: IResource,
  page: number | false = 0,
  rowsPerPage: number = defaultPageSize,
  searchParameters?: ISearchParameters,
  searchValue?: string,
  url?: string
): [
  IFetch<IHydraResponse<T>>,
  IResourceEditableOperations<T>,
  Dispatch<SetStateAction<T[]>>
] {
  const [response, updateList, load] = useApiList<T>(
    url ? url : resource,
    page,
    rowsPerPage,
    searchParameters,
    searchValue
  )
  const { create, remove, replace, update } = useResourceOperations<T>(resource)

  const debouncedUpdate = useMemo(
    () =>
      debounce(
        async (id: string | number, updatedItem: Partial<T>): Promise<void> => {
          const updateResponse = await update(id, updatedItem)
          if (isError(updateResponse) || searchParameters || searchValue) {
            // reload if error or if any filter is applied
            load()
          }
        },
        debounceDelay
      ),
    [load, searchParameters, searchValue, update]
  )

  const editableUpdate = useCallback(
    (id: string | number, updatedItem: Partial<T>): void => {
      updateList((items) =>
        items.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      )
      debouncedUpdate(id, updatedItem)
    },
    [debouncedUpdate, updateList]
  )

  const massEditableUpdate = useCallback(
    async (
      ids: (string | number)[],
      updatedItem: Partial<T>
    ): Promise<void> => {
      updateList((items) =>
        items.map((item) =>
          ids.includes(item.id) ? { ...item, ...updatedItem } : item
        )
      )
      const promises = ids.map((id) => update(id, updatedItem))
      const responses = await Promise.all(promises)
      const hasError = responses.some((response) => isError(response))
      if (hasError || searchParameters || searchValue) {
        // reload if error or if any filter is applied
        load()
      }
    },
    [load, searchParameters, searchValue, update, updateList]
  )

  const massEditableReplace = useCallback(
    async (
      ids: (string | number)[],
      updatedItem: Omit<T, '@id' | '@type'>
    ): Promise<void> => {
      updateList((items) =>
        items.map((item) =>
          ids.includes(item.id) ? { ...item, ...updatedItem } : item
        )
      )
      const promises = ids.map((id) =>
        replace({ id, ...updatedItem } as unknown as T)
      )
      const responses = await Promise.all(promises)
      const hasError = responses.some((response) => isError(response))
      if (hasError || searchParameters || searchValue) {
        // reload if error or if any filter is applied
        load()
      }
    },
    [load, searchParameters, searchValue, replace, updateList]
  )

  const editableCreate = useCallback(
    async (item: Omit<T, 'id' | '@id' | '@type'>): Promise<void> => {
      const createResponse = await create(item)
      if (
        !isError(createResponse) &&
        response.data['hydra:member'].length < rowsPerPage
      ) {
        // reload if item has been added and we are on the last page
        load()
      }
    },
    [create, load, response, rowsPerPage]
  )

  const editableReplace = useCallback(
    async (replacedItem: Omit<T, '@id' | '@type'>): Promise<void> => {
      updateList((items) =>
        items.map((item) =>
          item.id === replacedItem.id ? { ...item, ...replacedItem } : item
        )
      )
      const response = await replace(replacedItem)
      if (isError(response) || searchParameters || searchValue) {
        // reload if error or if any filter is applied
        load()
      }
    },
    [load, replace, searchParameters, searchValue, updateList]
  )

  const editableRemove = useCallback(
    async (id: string | number): Promise<void> => {
      updateList((items) => items.filter((item) => item.id !== id))
      const removeResponse = await remove(id)
      if (
        isError(removeResponse) ||
        response.data['hydra:member'].length === rowsPerPage
      ) {
        // reload if error
        // and reload if we are not on the last page to fill the space left by the deleted item
        load()
      }
    },
    [load, remove, response, rowsPerPage, updateList]
  )

  const operations = useMemo(() => {
    const operations: IResourceEditableOperations<T> = {}
    if (update) {
      operations.update = editableUpdate
      operations.massUpdate = massEditableUpdate
    }
    if (create) {
      operations.create = editableCreate
    }
    if (replace) {
      operations.replace = editableReplace
      operations.massReplace = massEditableReplace
    }
    if (remove) {
      operations.remove = editableRemove
    }
    return operations
  }, [
    create,
    editableCreate,
    editableRemove,
    editableReplace,
    editableUpdate,
    massEditableUpdate,
    massEditableReplace,
    remove,
    replace,
    update,
  ])

  return [response, operations, updateList]
}
