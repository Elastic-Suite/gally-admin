import { ICatalog, getLocalizedCatalog } from 'gally-admin-shared'
import React, { ReactNode, useMemo } from 'react'

import { catalogContext } from '../../../contexts'

interface IProps {
  catalogId: number
  catalogs: ICatalog[]
  children: ReactNode
  localizedCatalogId: number
}

function CatalogProvider(props: IProps): JSX.Element {
  const { catalogId, catalogs, children, localizedCatalogId } = props

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
      localizedCatalog,
      localizedCatalogId,
      localizedCatalogWithDefault,
      localizedCatalogIdWithDefault: String(localizedCatalogWithDefault.id),
    }),
    [
      catalog,
      catalogId,
      localizedCatalog,
      localizedCatalogId,
      localizedCatalogWithDefault,
    ]
  )

  return (
    <catalogContext.Provider value={contextValue}>
      {children}
    </catalogContext.Provider>
  )
}

export default CatalogProvider
