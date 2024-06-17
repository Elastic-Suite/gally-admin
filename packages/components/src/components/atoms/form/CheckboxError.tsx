import React, { ForwardedRef, useCallback } from 'react'

import {
  IFieldErrorProps,
  IOnChange,
  IValidator,
  useFormError,
} from '../../../hooks'

import Checkbox, { ICheckboxProps } from './Checkbox'

interface ICheckboxErrorProps extends IFieldErrorProps, ICheckboxProps {}

function CheckboxError(props: ICheckboxErrorProps): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props

  const validator = useCallback<IValidator>(
    (value, event) => {
      if (additionalValidator) return additionalValidator(value, event)
      return ''
    },
    [additionalValidator]
  )

  const [{ ref, ...formErrorProps }] = useFormError(
    onChange as IOnChange,
    inputProps.checked,
    showError,
    validator,
    inputProps.disabled
  )

  return (
    <Checkbox
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref as ForwardedRef<HTMLInputElement>}
    />
  )
}

export default CheckboxError
