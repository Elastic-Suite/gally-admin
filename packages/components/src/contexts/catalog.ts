import { ICatalog, IHydraCatalog, ILocalizedCatalog } from 'gally-admin-shared'
import { Dispatch, SetStateAction, createContext } from 'react'

interface ICatalogContext {
  catalog: ICatalog
  catalogId: number
  catalogs: IHydraCatalog[]
  localizedCatalog: ILocalizedCatalog
  localizedCatalogId: number
  localizedCatalogWithDefault: ILocalizedCatalog
  localizedCatalogIdWithDefault: string
  setCatalogId: Dispatch<SetStateAction<number>>
  setLocalizedCatalogId: Dispatch<SetStateAction<number>>
}

export const catalogContext = createContext<ICatalogContext>(null)
