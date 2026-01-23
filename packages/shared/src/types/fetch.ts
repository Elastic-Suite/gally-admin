import { IResource } from './api'
import { IError } from './network'

export enum LoadStatus {
  FAILED,
  IDLE,
  LOADING,
  SUCCEEDED,
}

export interface IFetch<D> {
  data?: D
  error?: Error
  status: LoadStatus
}

export interface IGraphqlResponse<D> {
  data: D
}

export type IParam = string | number | boolean | Date

export type ISearchParameters = Record<string, IParam | IParam[]>

export type IFetchApi = <T extends object>(
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit,
  outputLog?: boolean
) => Promise<T | IError>
