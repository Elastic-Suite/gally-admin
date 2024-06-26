import { IGallyProperty } from './hydra'
import { IJsonldBase, IJsonldId, IJsonldType } from './jsonld'
import { IError, Method } from './network'

export interface IProperty extends IJsonldBase {
  domain: IJsonldId
  label: string
  range?: IJsonldId
}

export interface IField extends IJsonldType {
  description?: string
  property: IProperty
  readable: boolean
  required: boolean
  title: string
  writeable: boolean
  gally?: IGallyProperty
}

export interface IOperation extends IJsonldType {
  expects?: string
  label: string
  method: Method
  returns: IJsonldId
  title: string
}

export interface IGallyClass {
  fieldset: Record<
    string,
    { position: number; label?: string; tooltip?: string }
  >
}

export interface IResource extends IJsonldBase {
  label?: string
  supportedOperation: IOperation[]
  supportedProperty: IField[]
  title: string
  url: string
  gally?: IGallyClass
}

export type IApi = IResource[]

export interface IResponseError {
  code: number
  message: string
}

export interface IResourceOperations<T> {
  create?: (item: Omit<T, 'id' | '@id' | '@type'>) => Promise<T | IError>
  remove?: (id: string | number) => Promise<T | IError>
  replace?: (item: Partial<T>) => Promise<T | IError>
  update?: (id: string | number, item: Partial<T>) => Promise<T | IError>
}

export type IResourceEditableCreate<T> = (
  item: Omit<T, 'id' | '@id' | '@type'>
) => Promise<void>
export type IResourceEditableMassUpdate<T> = (
  ids: (string | number)[],
  item: Partial<T>
) => Promise<void>
export type IResourceEditableMassReplace<T> = (
  ids: (string | number)[],
  item: Omit<T, '@id' | '@type'>
) => Promise<void>
export type IResourceEditableRemove = (id: string | number) => Promise<void>
export type IResourceEditableReplace<T> = (
  item: Partial<T>,
  isValid?: boolean
) => void
export type IResourceEditableUpdate<T> = (
  id: string | number,
  item: Partial<T>,
  isValid?: boolean
) => void

export interface IResourceEditableOperations<T> {
  create?: IResourceEditableCreate<T>
  massUpdate?: IResourceEditableMassUpdate<T>
  massReplace?: IResourceEditableMassReplace<T>
  remove?: IResourceEditableRemove
  replace?: IResourceEditableReplace<T>
  update?: IResourceEditableUpdate<T>
}

export type ILoadResource = () => void
