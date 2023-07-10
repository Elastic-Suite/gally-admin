export interface ISynonymTerm {
  '@id'?: string
  '@type'?: string
  term: string
}

export interface ISynonym {
  '@id'?: string
  '@type'?: string
  terms: ISynonymTerm[]
}

export type ISynonyms = ISynonym[]
