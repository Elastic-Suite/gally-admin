import { differenceInSeconds } from 'date-fns'
import React, { useRef, useState } from 'react'
import { useFormError } from '../../../hooks'

import { dateValidator } from './DatePickerError'
import DoubleDatePicker, {
  IDoubleDatePickerProps,
} from './DoubleDatePicker'

export function doubleDateValidator(value: {
  from: Date | null
  to: Date | null
}, required?: boolean): string | null {

  if (!value.from || !value.to) {
    return required ? 'valueMissing' :''
  }
  const fromError = dateValidator(value.from)
  if (fromError) {
    return fromError
  }
  const toError = dateValidator(value.to)
  if (toError) {
    return toError
  }
  if (differenceInSeconds(value.to, value.from) >= 0) {
    return ""
  }
  return 'doubleDatePickerRange'
}

interface IDoubleDatePickerErrorProps extends IDoubleDatePickerProps {
  showError?: boolean
}

function DoubleDatePickerError(
  props: IDoubleDatePickerErrorProps
): JSX.Element {
  const ref = useRef(null)
  const [test, setTest] = useState({from: false, to: false})
  const { onChange, showError, ...inputProps } = props
  const [formErrorProps] = useFormError(
    onChange,
    showError,
    (value) => {
      if(value.from && !test.from){
        setTest({...test, from: true})
      }
      if(value.to && !test.to){
        setTest({...test, to: true})
      }
      return doubleDateValidator(value, inputProps.required && test.from && test.to)},
    ref
  )

  return (
    <DoubleDatePicker
      {...inputProps}
      {...formErrorProps}
      ref={ref}
    />
  )
}

export default DoubleDatePickerError
