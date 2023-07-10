export interface IExpansionTerm {
  '@id'?: string
  '@type'?: string
  term: string
}

export interface IExpansion {
  '@id'?: string
  '@type'?: string
  referenceTerm: string
  terms: IExpansionTerm[]
}

export type IExpansions = IExpansion[]
