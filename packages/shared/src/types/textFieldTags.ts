import { IOptionsTags } from './textFieldTagsMultiple'

export interface ITextFieldTagsForm {
  disabled?: boolean
  disabledValue?: string
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  helperText?: string
  helperIcon?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  required?: boolean
  size?: 'small' | 'medium' | undefined
  placeholder?: string
  options: IOptionsTags[]
}
