import React from 'react'

import { IFieldErrorProps, useFormError } from '../../../hooks'

import TextFieldTags, { ITextFieldTag } from './TextFieldTags'

interface ITextFieldTagErrorProps extends IFieldErrorProps, ITextFieldTag {}

function TextFieldTagsError(props: ITextFieldTagErrorProps): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props
  const [{ ref, ...formErrorProps }] = useFormError(
    onChange,
    inputProps.value,
    showError,
    (value: string[], event): string => {
      if (inputProps.required && (value.length === 0 || value[0] === null)) {
        return 'valueMissing'
      }
      if (additionalValidator) {
        return additionalValidator(value, event)
      }
      return ''
    },
    inputProps.disabled
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

export default TextFieldTagsError
