export interface IOptionsTags {
  id: string
  value: string
  label: string
}

export interface ISearchLimitations {
  '@id'?: string
  '@type'?: string
  operator: string
  queryText: string | null
}

export type ITransformedLimitations = Record<string, string[]>
