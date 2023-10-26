import { SortOrder } from './sortingOption'
import { IGraphqlAggregation } from './aggregation'
export interface IGraphqlSearchDocumentsVariables {
  entityType: string
  localizedCatalog: string
  currentPage?: number
  filter?: IDocumentFieldFilterInput[] | IDocumentFieldFilterInput
  pageSize?: number
  search?: string
  sort?: IGraphqlDocumentSort
}

export interface IGraphqlSearchDocuments {
  documents: IGraphqlSearchDocument
}

export interface IGraphqlSearchDocument {
  collection: IGraphqlDocument[]
  paginationInfo: IGraphqlDocumentPaginationInfo
  sortInfo: IGraphqlDocumentSortInfo
  aggregations?: IGraphqlAggregation[]
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

export interface IGraphqlDocumentSort {
  field: string
  direction: SortOrder
}
export interface IGraphqlDocumentSortInfo {
  current: IGraphqlDocumentSortInfoCurrent[]
}

export interface IGraphqlDocumentSortInfoCurrent {
  field: string
  direction: SortOrder
}

export interface IDocumentBoolFilterInput {
  _must?: IDocumentFieldFilterInput[]
  _should?: IDocumentFieldFilterInput[]
  _not?: IDocumentFieldFilterInput[]
}

export interface IDocumentEqualFilterInput {
  field: string
  eq?: string
  in?: string[]
}

export interface IDocumentMatchFilterInput {
  field: string
  match: string
}

export interface IDocumentRangeFilterInput {
  field: string
  gte?: string
  gt?: string
  lt?: string
  lte?: string
}

export interface IDocumentExistFilterInput {
  field: string
}

export interface IDocumentFieldFilterInput {
  boolFilter?: IDocumentBoolFilterInput
  equalFilter?: IDocumentEqualFilterInput
  matchFilter?: IDocumentMatchFilterInput
  rangeFilter?: IDocumentRangeFilterInput
  existFilter?: IDocumentExistFilterInput
}
