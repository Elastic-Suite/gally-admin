export enum AggregationType {
  CATEGORY = 'category',
  CHECKBOX = 'checkbox',
  SLIDER = 'slider',
  BOOLEAN = 'boolean',
  HISTOGRAM = 'histogram',
}
export interface IGraphqlAggregation {
  count: number
  field: string
  label: string
  type: AggregationType
  options: IGraphqlAggregationOption[]
  hasMore: boolean | null
}

export interface IGraphqlAggregationOption {
  count: number
  label: string
  value: string
}
