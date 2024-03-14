import React from 'react'

import { IFieldErrorProps, useFormError } from '../../../hooks'

import Dropdown, { IDropDownProps } from './DropDown'

interface IDropDownErrorProps<T> extends IFieldErrorProps, IDropDownProps<T> {}

function DropdownError<T>(props: IDropDownErrorProps<T>): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props
  const [{ ref, ...formErrorProps }] = useFormError(
    onChange,
    inputProps.value,
    showError,
    (value, event) => {
      if (
        inputProps.required &&
        (!value || (value as unknown[]).length === 0)
      ) {
        return 'valueMissing'
      }
      if (additionalValidator) return additionalValidator(value, event)
      return ''
    },
    inputProps.disabled
  )
  return (
    <Dropdown
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref}
    />
  )
}

export default DropdownError
