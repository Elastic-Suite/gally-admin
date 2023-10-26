import { IJsonldBase } from './jsonld'

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface ISortingOption extends IJsonldBase {
  label: string
  code: string
}

export interface IGraphqlSortingOptions {
  sortingOptions: ISortingOption[]
}
