import { IDocumentFieldFilterInput } from './documents'

export interface IGraphqlViewMoreFacetOption {
  id: string
  value: string
  label: string
  count: number
}

export interface IGraphqlViewMoreFacetOptionsVariables {
  entityType: string
  aggregation: string
  localizedCatalog: string
  filter?: IDocumentFieldFilterInput[] | IDocumentFieldFilterInput
  search?: string
  optionSearch?: string
}

export interface IGraphqlViewMoreFacetOptions {
  viewMoreFacetOptions: IGraphqlViewMoreFacetOption[]
}
