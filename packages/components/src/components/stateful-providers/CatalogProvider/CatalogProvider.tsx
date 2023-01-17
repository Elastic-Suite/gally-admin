import {
  IHydraCatalog,
  IHydraResponse,
  getLocalizedCatalog,
  isError,
  isValidUser,
} from 'gally-admin-shared'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'

import { catalogContext } from '../../../contexts'
import { useApiFetch, useLog, useResource } from '../../../hooks'
import { selectUser, useAppSelector } from '../../../store'

interface IProps {
  children: ReactNode
}

function CatalogProvider(props: IProps): JSX.Element {
  const { children } = props

  const log = useLog()
  const fetchApi = useApiFetch()
  const resource = useResource('Catalog')
  const user = useAppSelector(selectUser)

  const [catalogs, setCatalogs] = useState<IHydraCatalog[]>([])
  const [catalogId, setCatalogId] = useState<number>(-1)
  const [localizedCatalogId, setLocalizedCatalogId] = useState<number>(-1)

  useEffect(() => {
    if (isValidUser(user)) {
      fetchApi<IHydraResponse<IHydraCatalog>>(resource).then((json) => {
        if (isError(json)) {
          log(json.error)
        } else {
          setCatalogs(json['hydra:member'])
        }
      })
    }
  }, [fetchApi, log, resource, user])

  const catalog = useMemo(
    () => catalogs.find((catalog) => catalog.id === catalogId),
    [catalogId, catalogs]
  )
  const localizedCatalog = useMemo(
    () =>
      catalog?.localizedCatalogs.find(
        (localizedCatalog) => localizedCatalog.id === localizedCatalogId
      ),
    [catalog, localizedCatalogId]
  )
  const localizedCatalogWithDefault = useMemo(
    () =>
      catalogs
        ? getLocalizedCatalog(catalog, localizedCatalog, catalogs)
        : null,
    [catalog, catalogs, localizedCatalog]
  )

  const contextValue = useMemo(
    () => ({
      catalog,
      catalogId,
      catalogs,
      localizedCatalog,
      localizedCatalogId,
      localizedCatalogWithDefault,
      localizedCatalogIdWithDefault: String(localizedCatalogWithDefault?.id),
      setCatalogId,
      setLocalizedCatalogId,
    }),
    [
      catalog,
      catalogId,
      catalogs,
      localizedCatalog,
      localizedCatalogId,
      localizedCatalogWithDefault,
      setCatalogId,
      setLocalizedCatalogId,
    ]
  )

  if (catalogs.length === 0) {
    return null
  }

  return (
    <catalogContext.Provider value={contextValue}>
      {children}
    </catalogContext.Provider>
  )
}

export default CatalogProvider
