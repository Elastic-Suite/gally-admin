import { MutableRefObject } from 'react'

import { IField, IResource } from './api'
import { ISearchParameters, LoadStatus } from './fetch'

export interface IOption<T> {
  disabled?: boolean
  id?: string | number
  label?: string
  value: T
  default?: boolean
  field?: string
  input?: string
  jsonKeyValue?: string
}

export type IOptions<T> = IOption<T>[]

export type IFieldOptions = Map<string, IOptions<string | number>>

export type ILoadStatuses = Map<string, LoadStatus>

export interface IOptionsContext {
  load: (field: IField) => void
  loadOptions: (
    id: string,
    resource: IResource | string,
    searchParameters?: ISearchParameters
  ) => void
  fieldOptions: IFieldOptions
  statuses: MutableRefObject<ILoadStatuses>
}

export interface IApiSchemaOptions {
  code?: string
  label: string
  id?: string
  value?: string
  options?: IApiSchemaOptions[]
}
