import { ISortingOption, SortOrder } from './sortingOption'
import { IPrice, IStock } from './customTables'
import { ISearchParameters } from './fetch'
import { IGraphqlAggregation } from './aggregation'
import {
  IGraphqlViewMoreFacetOption,
  IGraphqlViewMoreFacetOptionsVariables,
} from './facet'

export enum ProductRequestType {
  CATALOG = 'product_catalog',
  SEARCH = 'product_search',
  COVERAGE_RATE = 'product_coverage_rate',
  AUTOCOMPLETE = 'product_autocomplete',
}

export interface IGraphqlSearchProductsVariables {
  localizedCatalog: string
  currentCategoryId?: string
  currentPage?: number
  filter?: IProductFieldFilterInput[] | IProductFieldFilterInput
  pageSize?: number
  requestType: ProductRequestType
  search?: string
  sort?: Record<string, SortOrder>
}

export interface IGraphqlSearchProducts {
  products: IGraphqlSearchProduct
}

export interface IGraphqlSearchProduct {
  collection: IGraphqlProduct[]
  paginationInfo: IGraphqlProductPaginationInfo
  sortInfo: IGraphqlProductSortInfo
  aggregations?: IGraphqlAggregation[]
}

export interface IGraphqlProduct {
  id: string
  price?: IPrice[]
  sku: string
  name: string
  brand?: string
  stock: IStock
  score: number
}

export interface IGraphqlProductPaginationInfo {
  lastPage: number
  totalCount: number
}

export interface IGraphqlProductSortInfo {
  current: IGraphqlProductSortInfoCurrent[]
}

export interface IGraphqlProductSortInfoCurrent {
  field: string
  direction: SortOrder
}

export interface IFetchParams {
  options: RequestInit
  searchParameters: ISearchParameters
}

export interface IProductBoolFilterInput {
  _must?: IProductFieldFilterInput[]
  _should?: IProductFieldFilterInput[]
  _not?: IProductFieldFilterInput[]
}

export interface ICategoryTypeDefaultFilterInputType {
  eq: string
}

export interface IStockTypeDefaultFilterInputType {
  eq?: boolean
  exist?: boolean
}

export interface ISelectTypeDefaultFilterInputType {
  eq?: string
  in?: string[]
  exist?: boolean
}

export interface IEntityTextTypeFilterInput
  extends ISelectTypeDefaultFilterInputType {
  match?: string
}

export interface IEntityIntegerTypeFilterInput {
  eq?: number
  in?: number[]
  gte?: number | string
  gt?: number | string
  lt?: number | string
  lte?: number | string
  exist?: boolean
}

export type ITypeFilterInput =
  | IEntityIntegerTypeFilterInput
  | IEntityTextTypeFilterInput
  | ISelectTypeDefaultFilterInputType
  | IStockTypeDefaultFilterInputType
  | ICategoryTypeDefaultFilterInputType
  | IProductBoolFilterInput

export interface IProductFieldFilterInput {
  boolFilter?: IProductBoolFilterInput
  [key: string]: ITypeFilterInput
}

export interface IGraphqlViewMoreProductFacetOptionsVariables
  extends Omit<IGraphqlViewMoreFacetOptionsVariables, 'entityType'> {
  currentCategoryId?: string
  filter?: IProductFieldFilterInput[] | IProductFieldFilterInput
}

export interface IGraphqlViewMoreProductFacetOptions {
  viewMoreProductFacetOptions: IGraphqlViewMoreFacetOption[]
}

export interface IGraphqlProductSortingOptions {
  productSortingOptions: ISortingOption[]
}
