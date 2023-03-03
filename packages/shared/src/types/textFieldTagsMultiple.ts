export interface IOptionsTags {
  id: string
  value: string
  label: string
}

export interface ILimitations {
  '@id'?: string
  '@type'?: string
  operator: string
  queryText: string | null
}

export type ITransformedLimitations = Record<string, string[]>
