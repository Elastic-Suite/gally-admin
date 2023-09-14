import React from 'react'
import dayjs from 'dayjs'

import { useFormError } from '../../../hooks'

import DoubleDatePicker, {
  IDoubleDatePickerProps,
} from './DoubleDatePicker'
import { IRequestType } from '@elastic-suite/gally-admin-shared'

export function requestTypeValidator(value: IRequestType): string | null {
  return null
}

interface IDoubleDatePickerErrorProps extends IDoubleDatePickerProps {
  showError?: boolean
}

function RequestTypeError(
  props: IDoubleDatePickerErrorProps
): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const [formErrorProps] = useFormError(
    onChange,
    showError,
    requestTypeValidator
  )

  return (
    <DoubleDatePicker
      {...inputProps}
      {...formErrorProps}
    />
  )
}

export default RequestTypeError
