import { SortOrder } from './categorySortingOption'
import { ISearchParameters } from './fetch'
export interface IGraphqlSearchDocumentsVariables {
  entityType: string
  localizedCatalog: string
  currentCategoryId?: string
  currentPage?: number
  filter?: IDocumentFieldFilterInput[] | IDocumentFieldFilterInput
  pageSize?: number
  search?: string
  sort?: Record<string, SortOrder>
}

export enum AggregationType {
  CATEGORY = 'category',
  CHECKBOX = 'checkbox',
  SLIDER = 'slider',
  BOOLEAN = 'boolean',
}

export interface IGraphqlSearchDocuments {
  documents: IGraphqlSearchDocument
}

export interface IGraphqlSearchDocument {
  collection: IGraphqlDocument[]
  paginationInfo: IGraphqlDocumentPaginationInfo
  sortInfo: IGraphqlDocumentSortInfo
  aggregations?: IGraphqlDocumentAggregation[]
}

export interface IGraphqlDocument {
  id: string
  source: Record<string, any>
  score: string
}

export interface IGraphqlDocumentPaginationInfo {
  lastPage: number
  totalCount: number
}

export interface IGraphqlDocumentSortInfo {
  current: IGraphqlDocumentSortInfoCurrent[]
}

export interface IGraphqlDocumentSortInfoCurrent {
  field: string
  direction: SortOrder
}

export interface IGraphqlDocumentAggregation {
  count: number
  field: string
  label: string
  type: AggregationType
  options: IGraphqlDocumentAggregationOption[]
  hasMore: boolean | null
}

export interface IGraphqlDocumentAggregationOption {
  count: number
  label: string
  value: string
}

export interface IFetchParams {
  options: RequestInit
  searchParameters: ISearchParameters
}

export interface IDocumentBoolFilterInput {
  _must?: IDocumentFieldFilterInput[]
  _should?: IDocumentFieldFilterInput[]
  _not?: IDocumentFieldFilterInput[]
}

export interface IDocumentEqualFilterInput {
  field?: string
  eq: string
  in: string[]
}

export interface IDocumentMatchFilterInput {
  field?: string
  match?: string
}

export interface IDocumentRangeFilterInput {
  field?: string
  gte?: string
  gt?: string
  lt?: string
  lte?: string
}

export interface IDocumentExistFilterInput {
  field?: string
}

export interface IDocumentFieldFilterInput {
  boolFilter?: IDocumentBoolFilterInput
}
