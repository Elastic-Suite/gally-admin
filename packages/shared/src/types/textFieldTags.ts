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
