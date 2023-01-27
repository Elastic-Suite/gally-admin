export interface IDataTags {
  label: string
  id: number
}

export interface ITextFieldTags {
  label?: string
  id: string
  labelIsAll?: string
  data: IDataTags[]
}

export enum RequestType {
  PRODUCTS = 'products',
  CATEGORIES = 'categories',
  TAGS = 'tags',
}

export interface IRequestType
  extends Omit<ITextFieldTags, 'label' | 'labelIsAll'> {
  isSelected: boolean
  value: number
  type: RequestType
  labelIsAll: string
  label: string
}
