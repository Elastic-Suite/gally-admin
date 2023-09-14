import React, { ForwardedRef, forwardRef, useRef } from 'react'

import { useFormError } from '../../../hooks'

import TextFieldTags, { ITextFieldTag } from './TextFieldTags'

interface ITextFieldTagErrorProps extends ITextFieldTag {
  showError?: boolean
}

function TextFieldTagsError(
  props: ITextFieldTagErrorProps
  // ref: ForwardedRef<HTMLDivElement>
): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const ref = useRef(null)
  const [formErrorProps] = useFormError(
    onChange,
    inputProps.value,
    showError,
    (value: string[]): string => {
      if (inputProps.required) {
        return value.length === 0 ? 'valueMissing' : ''
      }
      return ''
    },
    ref
  )
  return (
    <TextFieldTags
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref}
    />
  )
}

export default forwardRef(TextFieldTagsError)
