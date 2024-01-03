import { IPrice, IScore, IStock } from './customTables'

export interface IPreviewProduct {
  id: string | number
  image: string
  name: string
  price: IPrice[]
  stock: IStock
  score: IScore | number
}

export interface IPreviewBoostingProducts {
  resultsBefore: IPreviewProduct[]
  resultsAfter: IPreviewProduct[]
}

export interface IGraphQLPagination {
  totalItems: number
  lastPage: number
  itemsPerPage: number
}

export interface IGraphqlPreviewBoost {
  previewBoost: {
    id: string
  } & IPreviewBoostingProducts &
    IGraphQLPagination
}
