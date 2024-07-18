import React, { ForwardedRef, SyntheticEvent, useCallback } from 'react'

import { IFieldErrorProps, IValidator, useFormError } from '../../../hooks'

import TextFieldTagsWithoutError, {
  ITextFieldTag,
} from './TextFieldTagsWithoutError'

interface ITextFieldTagErrorProps extends IFieldErrorProps, ITextFieldTag {}

function TextFieldTags(props: ITextFieldTagErrorProps): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props

  const validator = useCallback<IValidator>(
    (value: string[], event: SyntheticEvent): string => {
      if (inputProps.required && (value.length === 0 || value[0] === null)) {
        return 'valueMissing'
      }
      if (additionalValidator) {
        return additionalValidator(value, event)
      }
      return ''
    },
    [additionalValidator, inputProps.required]
  )

  const [{ ref, ...formErrorProps }] = useFormError(
    onChange,
    inputProps.value,
    showError,
    validator,
    inputProps.disabled
  )

  return (
    <TextFieldTagsWithoutError
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref as ForwardedRef<HTMLInputElement>}
    />
  )
}

export default TextFieldTags
