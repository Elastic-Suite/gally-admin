import React from 'react'

import { useFormError } from '../../../hooks'

import Dropdown, { IDropDownProps } from './DropDown'

interface IDropDownErrorProps<T> extends IDropDownProps<T> {
  showError?: boolean
}

function DropdownError<T>(props: IDropDownErrorProps<T>): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const [formErrorProps] = useFormError(onChange, showError)
  return (
    <Dropdown
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
    />
  )
}

export default DropdownError
