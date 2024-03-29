import { ITreeItem } from './tree'
import { IGraphqlAggregation } from './aggregation'
import {
  IGraphqlProduct,
  IGraphqlProductPaginationInfo,
  IGraphqlProductSortInfo,
} from './products'
import { IImage, IScore } from './customTables'

export interface IExplainVariables {
  localizedCatalog?: string
  category?: ITreeItem
  requestType?: string
  search?: string
}

export interface IGraphqlSearchExplainProducts {
  explain: IGraphqlSearchExplainProduct
}

export interface IGraphqlSearchExplainProduct {
  collection: IGraphqlExplainProduct[]
  paginationInfo: IGraphqlProductPaginationInfo
  sortInfo: IGraphqlProductSortInfo
  aggregations?: IGraphqlAggregation[]
  explainData: IGraphqlProductExplainData
}

export interface IGraphqlExplainProduct extends Omit<IGraphqlProduct, 'score'> {
  image: IImage | string
  score: IScore | number
  explanation: Record<string, unknown>
  sort: (string | number)[]
  boosts: Record<string, unknown>
  matches: Record<string, unknown>[]
  highlights: Record<string, unknown>[]
  legends: Record<string, Record<string, IGraphqlProductExplainLegend>>
  fieldHighlights: Record<string, unknown>[]
}

export interface IGraphqlProductExplainData {
  elasticSearchQuery: IGraphqlProductExplainQuery
  isSpellchecked: boolean
  extraData: Record<string, unknown>
}

export interface IGraphqlProductExplainQuery {
  index: string
  query: string
}

export interface IGraphqlProductExplainLegend {
  field: string
  legend: string
}
