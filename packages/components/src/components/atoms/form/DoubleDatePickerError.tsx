import React from 'react'
import { differenceInSeconds } from 'date-fns'
import { useFormError } from '../../../hooks'

import { dateValidator } from './DatePickerError'
import DoubleDatePicker, {
  IDoubleDatePickerErrors,
  IDoubleDatePickerProps,
} from './DoubleDatePicker'

export function doubleDateValidator(value: {
  from: Date | null
  to: Date | null
}): string | null {
  const fromError = dateValidator(value.from)
  if (fromError) {
    return fromError
  }
  const toError = dateValidator(value.to)
  if (toError) {
    return toError
  }
  if (!value.from || !value.to) {
    return null
  }
  if (differenceInSeconds(value.to, value.from) >= 0) {
    return null
  }
  return 'doubleDatePickerRange'
}

interface IDoubleDatePickerErrorProps extends IDoubleDatePickerProps {
  showError?: boolean
}

function DoubleDatePickerError(
  props: IDoubleDatePickerErrorProps
): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const [formErrorProps, setError] = useFormError(
    onChange,
    showError,
    doubleDateValidator
  )

  function handleError(reason: IDoubleDatePickerErrors): void {
    if (reason.from) {
      setError(reason.from)
    } else {
      setError(reason.to)
    }
  }

  return (
    <DoubleDatePicker
      {...inputProps}
      {...formErrorProps}
      onError={handleError}
    />
  )
}

export default DoubleDatePickerError
