import React, { ForwardedRef, SyntheticEvent, useCallback } from 'react'
import { IFieldErrorProps, IValidator, useFormError } from '../../../hooks'

import { dateValidator } from './DatePicker'
import DoubleDatePicker, {
  IDoubleDatePickerProps,
  IDoubleDatePickerValues,
} from './DoubleDatePicker'
interface IDoubleDatePickerErrorProps
  extends IFieldErrorProps,
    IDoubleDatePickerProps {}

export function doubleDateValidator(
  value: IDoubleDatePickerValues,
  event?: SyntheticEvent,
  required?: boolean,
  additionalValidator?: IDoubleDatePickerErrorProps['additionalValidator']
): string | null {
  if (additionalValidator) {
    return additionalValidator(value, event)
  }
  if (required && (!value.fromDate || !value.toDate)) {
    return 'valueMissing'
  }
  const from =
    typeof value.fromDate === 'string'
      ? new Date(value.fromDate)
      : value.fromDate
  const to =
    typeof value.toDate === 'string' ? new Date(value.toDate) : value.toDate

  const fromError = dateValidator(from)
  if (fromError) {
    return fromError
  }
  const toError = dateValidator(to)
  if (toError) {
    return toError
  }

  if (!value.toDate || !value.fromDate || from <= to) {
    return ''
  }
  return 'doubleDatePickerRange'
}

function DoubleDatePickerError(
  props: IDoubleDatePickerErrorProps
): JSX.Element {
  const {
    onChange,
    showError,
    additionalValidator,
    replacementErrorsMessages,
    ...inputProps
  } = props

  const validator = useCallback<IValidator>(
    (value: IDoubleDatePickerValues, event) => {
      return doubleDateValidator(
        value,
        event,
        inputProps.required,
        additionalValidator
      )
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
    <DoubleDatePicker
      {...inputProps}
      {...formErrorProps}
      ref={ref as ForwardedRef<HTMLInputElement>}
    />
  )
}

export default DoubleDatePickerError
