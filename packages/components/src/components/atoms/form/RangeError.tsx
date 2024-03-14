import React from 'react'

import { IFieldErrorProps, useFormError } from '../../../hooks'

import Range, { IRangeProps } from './Range'

interface IRangeErrorProps extends IFieldErrorProps, IRangeProps {}

function RangeError(props: IRangeErrorProps): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props
  const [{ ref, ...formErrorProps }] = useFormError(
    onChange,
    inputProps.value,
    showError,
    additionalValidator,
    inputProps.disabled
  )
  return (
    <Range
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref}
    />
  )
}

export default RangeError
