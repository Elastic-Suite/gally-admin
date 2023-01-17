import {
  IHydraCatalog,
  getLocalizedCatalog,
} from '@elastic-suite/gally-admin-shared'
import { useMemo, useState } from 'react'

import { ICatalogContext } from '../contexts'

export function useCatalogs(catalogs: IHydraCatalog[]): ICatalogContext {
  const [catalogId, setCatalogId] = useState<number>(-1)
  const [localizedCatalogId, setLocalizedCatalogId] = useState<number>(-1)

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
        ? getLocalizedCatalog(catalogs, catalog, localizedCatalog)
        : null,
    [catalog, catalogs, localizedCatalog]
  )

  return useMemo(
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
}
