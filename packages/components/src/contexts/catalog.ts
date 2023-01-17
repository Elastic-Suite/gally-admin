import {
  ICatalog,
  IHydraCatalog,
  ILocalizedCatalog,
} from '@elastic-suite/gally-admin-shared'
import { Dispatch, SetStateAction, createContext } from 'react'

export interface ICatalogContext {
  catalog?: ICatalog
  catalogId: number
  catalogs: IHydraCatalog[]
  localizedCatalog?: ILocalizedCatalog
  localizedCatalogId: number
  localizedCatalogWithDefault: ILocalizedCatalog | null
  localizedCatalogIdWithDefault: string
  setCatalogId: Dispatch<SetStateAction<number>>
  setLocalizedCatalogId: Dispatch<SetStateAction<number>>
}

export const catalogContext = createContext<ICatalogContext>(null)
