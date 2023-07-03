import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react'
import {
  IFetchApi,
  ILoadStatuses,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'

import { useApiFetch } from './useApi'
import { useLog } from './useLog'

export type ILoader<T> = (fetchApi: IFetchApi) => Promise<T>

type IFetch<T> = (id: string, loader: ILoader<T>) => void

interface IUseLoader<T> {
  fetch: IFetch<T>
  map: Map<string, T>
  setMap: Dispatch<SetStateAction<Map<string, T>>>
  statuses: MutableRefObject<ILoadStatuses>
}

export function useSingletonLoader<T>(
  defaultState: Map<string, T> | (() => Map<string, T>) = new Map()
): IUseLoader<T> {
  const fetchApi = useApiFetch()
  const [map, setMap] = useState<Map<string, T>>(defaultState)
  const fieldOptionsStatuses = useRef<ILoadStatuses>(new Map())
  const log = useLog()
  const updateFieldOptions = useCallback((id: string, options: T) => {
    fieldOptionsStatuses.current.set(id, LoadStatus.SUCCEEDED)
    setMap((prevState) => {
      const clone = new Map(prevState)
      clone.set(id, options)
      return clone
    })
  }, [])

  const fetch = useCallback(
    async (id: string, loader: ILoader<T>) => {
      const status = fieldOptionsStatuses.current.get(id)
      if (!status) {
        fieldOptionsStatuses.current.set(id, LoadStatus.LOADING)
        try {
          const data = await loader(fetchApi)
          updateFieldOptions(id, data)
        } catch (err) {
          log(err)
          fieldOptionsStatuses.current.set(id, LoadStatus.FAILED)
        }
      }
    },
    [fetchApi, updateFieldOptions, log]
  )

  return { fetch, map, setMap, statuses: fieldOptionsStatuses }
}
