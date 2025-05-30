import { CSSProperties, SyntheticEvent } from 'react'

import { IField } from './api'
import { DataContentType, ITableRow } from './customTables'
import { IMultipleInputConfiguration, IMultipleValueFormat } from './hydra'
import { IOption, IOptions } from './option'

export interface IFieldState {
  disabled?: boolean
  visible?: boolean
}

export interface IFieldCondition {
  field: string
  value: any
}

export interface IFieldDepends {
  type: 'enabled' | 'visible'
  conditions: (IFieldCondition | IFieldCondition[])[] | IFieldCondition
}

export interface IFieldConfig extends IFieldState {
  depends?: IFieldDepends
  editable?: boolean
  field?: IField
  fieldset?: string
  id: string
  input?: DataContentType
  label?: string
  name: string
  multiple?: boolean
  options?: IOptions<unknown> | null
  required?: boolean
  suffix?: string
  type?: DataContentType
  validation?: Record<string, string | number>
  multipleValueFormat?: IMultipleValueFormat
  requestTypeConfigurations?: Record<string, string>
  optionConfig?: IOption<string>
  infoTooltip?: string
  multipleInputConfiguration?: IMultipleInputConfiguration
  placeholder?: string
  defaultValue?: unknown
  helperText?: string
  error?: boolean
  headerStyle?: CSSProperties
  cellsStyle?: CSSProperties
  showError?: boolean
  replacementErrorsMessages?: Record<string, string>
  gridHeaderInfoTooltip?: string
}

export interface IFieldConfigFormWithFieldset {
  position?: number
  label?: string
  tooltip?: string
  code: string
  children: IFieldConfig[]
  external?: boolean
}

export interface IFieldGuesserProps extends IFieldConfig {
  diffValue?: unknown
  onChange?: (
    name: string | IOption<string>,
    value: unknown,
    event?: SyntheticEvent
  ) => void
  showError?: boolean
  useDropdownBoolean?: boolean
  row?: ITableRow
  value: unknown
  data?: Record<string, unknown>
}
