import { IJsonldBase } from './jsonld'
import { ILimitations } from './textFieldTagsMultiple'

export interface ILimitationsTypes {
  label: string
  id?: string
  value: string
  labelAll: string
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

export interface IRequestType extends IJsonldBase {
  id: number
  name: string
  isActive: boolean
  model: string
  modelConfig: string
  localizedCatalogs: string[]
  requestTypes: IRequestTypes[]
  categoryLimitations: ICategoryLimitations[]
  searchLimitations: ILimitations[]
  createdAt: string
  updatedAt: string
}
