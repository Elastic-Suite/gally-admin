import React, { useRef } from 'react'
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation'
import { isValid } from 'date-fns'

import { useFormError } from '../../../hooks'

import DatePicker, { IDatePickerProps } from './DatePicker'

interface IDatePickerErrorProps extends IDatePickerProps {
  showError?: boolean
}

export function dateValidator(
  value: Date | null,
  required?: boolean
): string | null {
  if (!value) {
    return required ? 'valueMissing' : ''
  }
  if (isValid(value)) {
    return ''
  }
  return 'invalidDate'
}

function DatePickerError(props: IDatePickerErrorProps): JSX.Element {
  const ref = useRef(null)
  const { onChange, showError, ...inputProps } = props
  const [formErrorProps, setError] = useFormError(
    onChange,
    inputProps.value,
    showError,
    (value) => {
      return dateValidator(value as Date, inputProps.required)
    },
    ref
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
      ref={ref}
    />
  )
}

export default DatePickerError
