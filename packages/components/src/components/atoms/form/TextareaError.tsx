import React, { ForwardedRef, useCallback } from 'react'

import {
  IFieldErrorProps,
  IOnChange,
  IValidator,
  useFormError,
} from '../../../hooks'

import Textarea, { ITextareaProps } from './Textarea'

interface ITextAreaErrorProps extends IFieldErrorProps, ITextareaProps {}

function TextAreaError(props: ITextAreaErrorProps): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props

  const validator = useCallback<IValidator>(
    (value, event) => {
      if (additionalValidator) return additionalValidator(value, event)
      return ''
    },
    [additionalValidator]
  )

  const [{ ref, ...formErrorProps }] = useFormError(
    onChange as IOnChange,
    inputProps.value,
    showError,
    validator,
    inputProps.disabled
  )

  return (
    <Textarea
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref as ForwardedRef<HTMLTextAreaElement>}
    />
  )
}

export default TextAreaError
