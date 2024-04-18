import React, { ForwardedRef, useCallback } from 'react'

import { IFieldErrorProps, IValidator, useFormError } from '../../../hooks'

import Dropdown, { IDropDownProps } from './DropDown'

interface IDropDownErrorProps<T> extends IFieldErrorProps, IDropDownProps<T> {}

function DropdownError<T>(props: IDropDownErrorProps<T>): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props

  const validator = useCallback<IValidator>(
    (value, event) => {
      if (additionalValidator) return additionalValidator(value, event)
      if (
        inputProps.required &&
        (value === undefined ||
          value === '' ||
          (value as unknown[]).length === 0)
      ) {
        return 'valueMissing'
      }
      return ''
    },
    [additionalValidator, inputProps.required]
  )

  const [{ ref, ...formErrorProps }] = useFormError(
    onChange,
    inputProps.value,
    showError,
    validator,
    inputProps.disabled
  )

  return (
    <Dropdown
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref as ForwardedRef<HTMLInputElement>}
    />
  )
}

export default DropdownError
