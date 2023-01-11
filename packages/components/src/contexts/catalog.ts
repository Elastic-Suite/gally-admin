import { ICatalog, ILocalizedCatalog } from 'gally-admin-shared'
import { createContext } from 'react'

interface ICatalogContext {
  catalog: ICatalog
  catalogId: number
  localizedCatalog: ILocalizedCatalog
  localizedCatalogId: number
  localizedCatalogWithDefault: ILocalizedCatalog
  localizedCatalogIdWithDefault: string
}

export const catalogContext = createContext<ICatalogContext>(null)
