export enum AggregationType {
  CATEGORY = 'category',
  CHECKBOX = 'checkbox',
  SLIDER = 'slider',
  BOOLEAN = 'boolean',
  HISTOGRAM = 'histogram',
  HISTOGRAM_DATE = 'date_histogram',
}
export interface IGraphqlAggregation {
  count: number
  field: string
  label: string
  type: AggregationType
  options: IGraphqlAggregationOption[]
  hasMore: boolean | null
  date_format?: string
  date_range_interval?: string
}

export interface IGraphqlAggregationOption {
  count: number
  label: string
  value: string
}
