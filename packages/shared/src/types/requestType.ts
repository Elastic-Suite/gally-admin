import { ISearchLimitations } from './textFieldTagsMultiple'

export interface ILimitationsTypes {
  label: string
  id?: string
  value: string
  labelAll: string
}

export interface IRequestTypesOptions {
  label: string
  limitationType: string
  id: string
  value: string
}
export interface IRequestTypes {
  '@id'?: string
  '@type'?: string
  requestType: string
  applyToAll: boolean
}

export interface ICategoryLimitations {
  '@id'?: string
  '@type'?: string
  category: string
}

export interface IRequestType {
  requestTypes: IRequestTypes[]
  categoryLimitations: ICategoryLimitations[]
  searchLimitations: ISearchLimitations[]
  createdAt?: string
  updatedAt?: string
}
