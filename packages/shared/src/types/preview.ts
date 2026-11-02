import { IPrice, IScore, IStock } from './customTables'

export interface IPreviewProduct {
  id: string | number
  image: string
  name: string
  price: IPrice[]
  stock: IStock
  score: IScore | number
  effect?: -1 | 0 | 1
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

export enum RecommenderPreviewStatus {
  OK = 'ok',
  // The source product does not exist in the localized catalog
  SOURCE_NOT_FOUND = 'source_not_found',
  // The source rule does not select the source product
  NOT_APPLICABLE = 'not_applicable',
}

export enum RecommenderProductOrigin {
  CO_OCCURRENCE = 'co_occurrence',
  RULE = 'rule',
}

export interface IRecommenderPreviewProduct {
  id: string | number
  sku: string
  image: string
  name: string
  price: IPrice[]
  stock: IStock
  origin: RecommenderProductOrigin
}

export interface IGraphqlRecommenderPreview {
  getRecommenderPreview: {
    status: RecommenderPreviewStatus
    products: IRecommenderPreviewProduct[]
  }
}
