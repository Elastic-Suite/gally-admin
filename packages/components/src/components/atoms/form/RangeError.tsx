import React, { ForwardedRef, useCallback } from 'react'

import { IFieldErrorProps, IValidator, useFormError } from '../../../hooks'

import Range, { IRangeProps } from './Range'

interface IRangeErrorProps extends IFieldErrorProps, IRangeProps {}

function RangeError(props: IRangeErrorProps): JSX.Element {
  const {
    onChange,
    showError,
    additionalValidator,
    replacementErrorsMessages,
    ...inputProps
  } = props

  const validator = useCallback<IValidator>(
    (value: [number | string | null, number | string | null], event) => {
      if (additionalValidator) return additionalValidator(value, event)
      if (
        inputProps.required &&
        ((!value[0] && value[0] !== 0) || (!value[1] && value[1] !== 0))
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
    inputProps.disabled,
    replacementErrorsMessages
  )

  return (
    <Range
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref as ForwardedRef<HTMLInputElement>}
    />
  )
}

export default RangeError
