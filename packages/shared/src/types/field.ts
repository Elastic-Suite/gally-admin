import { SyntheticEvent } from 'react'

import { IField } from './api'
import { DataContentType, ITableRow } from './customTables'
import { IMultipleInputConfiguration } from './hydra'
import { IOption, IOptions } from './option'

export interface IFieldCondition {
  conditions: Record<string, unknown>
  disabled?: boolean
}

export interface IFieldState {
  disabled?: boolean
}

export interface IFieldConfig extends IFieldState {
  depends?: any
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
  multipleSeparatorValue?: string
  requestTypeConfigurations?: Record<string, string>
  optionConfig?: IOption<string>
  infoTooltip?: string
  multipleInputConfiguration?: IMultipleInputConfiguration
  placeholder?: string
  defaultValue?: unknown
  helperText?: string
  error?: boolean
}

export interface IFieldConfigFormWithFieldset {
  position?: number
  label?: string
  tooltip?: string
  code: string
  children: IFieldConfig[]
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
