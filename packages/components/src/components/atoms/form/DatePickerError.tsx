import React, { ForwardedRef, SyntheticEvent, useCallback } from 'react'
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation'
import { isValid } from 'date-fns'

import { IFieldErrorProps, IValidator, useFormError } from '../../../hooks'

import DatePicker, { IDatePickerProps } from './DatePicker'

interface IDatePickerErrorProps extends IFieldErrorProps, IDatePickerProps {}

export function dateValidator(
  value: Date | null,
  event?: SyntheticEvent,
  required?: boolean,
  additionalValidator?: IDatePickerErrorProps['additionalValidator']
): string | null {
  if (additionalValidator) {
    return additionalValidator(value, event)
  }

  if (!value && required) {
    return 'valueMissing'
  }

  if (!value || isValid(value)) {
    return ''
  }
  return 'invalidDate'
}

function DatePickerError(props: IDatePickerErrorProps): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props

  const validator = useCallback<IValidator>(
    (value, event) => {
      return dateValidator(
        value as Date,
        event,
        inputProps.required,
        additionalValidator
      )
    },
    [additionalValidator, inputProps.required]
  )

  const [{ ref, ...formErrorProps }, setError] = useFormError(
    onChange,
    inputProps.value,
    showError,
    validator,
    inputProps.disabled
  )

  function handleError(reason: DateValidationError): void {
    setError(reason)
  }

  return (
    <DatePicker
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      onError={handleError}
      ref={ref as ForwardedRef<HTMLInputElement>}
    />
  )
}

export default DatePickerError
