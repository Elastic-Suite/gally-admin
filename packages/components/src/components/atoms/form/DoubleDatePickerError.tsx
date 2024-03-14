import { differenceInSeconds } from 'date-fns'
import React, { SyntheticEvent } from 'react'
import { IFieldErrorProps, useFormError } from '../../../hooks'

import { dateValidator } from './DatePickerError'
import DoubleDatePicker, { IDoubleDatePickerProps } from './DoubleDatePicker'

interface IDate {
  from: Date | null
  to: Date | null
}
interface IDoubleDatePickerErrorProps
  extends IFieldErrorProps,
    IDoubleDatePickerProps {}

export function doubleDateValidator(
  value: IDate,
  event?: SyntheticEvent,
  required?: boolean,
  additionalValidator?: IDoubleDatePickerErrorProps['additionalValidator']
): string | null {
  if (required && (!value.from || !value.to)) {
    return 'valueMissing'
  }
  const fromError = dateValidator(value.from)
  if (fromError) {
    return fromError
  }
  const toError = dateValidator(value.to)
  if (toError) {
    return toError
  }
  if (additionalValidator) {
    return additionalValidator(value, event)
  }
  if (differenceInSeconds(value.to, value.from) >= 0) {
    return ''
  }
  return 'doubleDatePickerRange'
}
function DoubleDatePickerError(
  props: IDoubleDatePickerErrorProps
): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props
  const [{ ref, ...formErrorProps }] = useFormError(
    onChange,
    inputProps.value,
    showError,
    (value: IDate, event) => {
      return doubleDateValidator(
        value,
        event,
        inputProps.required,
        additionalValidator
      )
    },
    inputProps.disabled
  )

  return <DoubleDatePicker {...inputProps} {...formErrorProps} ref={ref} />
}

export default DoubleDatePickerError
