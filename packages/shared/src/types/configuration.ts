import {
  IDropdownApiOptions,
  IDropdownStaticOptions,
  IGallyProperty,
} from './hydra'
import { IJsonldBase } from './jsonld'

export enum ConfigurationScopeType {
  SCOPE_LOCALIZED_CATALOG = 'localized_catalog',
  SCOPE_REQUEST_TYPE = 'request_type',
  SCOPE_LOCALE = 'locale',
  SCOPE_LANGUAGE = 'language',
  SCOPE_GENERAL = 'general',
}

export interface IConfiguration {
  path: string
  scopeType?: ConfigurationScopeType
  value: object | number | string | any[] | boolean
  scopeCode: string
}

export type IConfigurationData = Record<string, IConfiguration['value']>

export interface IConfigurationTreeGroupFieldsetsField extends IGallyProperty {
  label: string
}

export interface IConfigurationTreeGroupFieldsets {
  label: string
  position: number
  tooltip: string
  fields: Record<string, IConfigurationTreeGroupFieldsetsField>
}

export interface IConfigurationTreeGroup {
  label: string
  scopeType: ConfigurationScopeType
  fieldsets: Record<string, IConfigurationTreeGroupFieldsets>
  position?: number
}

export interface IConfigurationTreeGroupFormatted
  extends Omit<IConfigurationTreeGroup, 'fieldsets'> {
  code: string
}

export interface IConfigurationTreeScope {
  input: string
  label: string
  filterName: string
  options: IDropdownStaticOptions & IDropdownApiOptions
}

export type IConfigurationTreeScopes = {
  [key in ConfigurationScopeType]: IConfigurationTreeScope
}

export interface IConfigurationTree extends IJsonldBase {
  groups: Record<string, IConfigurationTreeGroup>
  scopes: IConfigurationTreeScopes
}

export interface IConfigurationTreeData extends IJsonldBase {
  configTree: IConfigurationTree
}
