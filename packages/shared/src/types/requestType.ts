export enum RequestType {
  PRODUCTS = 'products',
  CATEGORIES = 'categories',
  TAGS = 'tags',
}

export interface IRequestType {
  isSelected: boolean
  value: number
  type: RequestType
  labelIsAll: string
  id: string
  label: string
  disabled: boolean
}
