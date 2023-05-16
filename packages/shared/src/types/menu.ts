export interface IMenuChild {
  code: string
  label: string
  children?: IMenuChild[]
  path?: string
}

export interface IMenu {
  hierarchy: IMenuChild[]
}
