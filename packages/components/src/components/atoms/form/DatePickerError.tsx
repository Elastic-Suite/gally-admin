import React from 'react'
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation'
import { Dayjs } from 'dayjs'

import { useFormError } from '../../../hooks'

import DatePicker, { IDatePickerProps } from './DatePicker'

interface IDatePickerErrorProps extends IDatePickerProps {
  showError?: boolean
}

export function dateValidator(value: Dayjs | null): string | null {
  if (!value) {
    return null
  }
  if (value.isValid()) {
    return null
  }
  return 'invalidDate'
}

function DatePickerError(props: IDatePickerErrorProps): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const [formErrorProps, setError] = useFormError(
    onChange,
    showError,
    dateValidator
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
    />
  )
}

export default DatePickerError
