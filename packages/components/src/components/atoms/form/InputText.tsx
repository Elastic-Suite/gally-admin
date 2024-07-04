import React, { ForwardedRef, useCallback } from 'react'

import { IFieldErrorProps, IValidator, useFormError } from '../../../hooks'

import InputTextWithoutError, { IInputTextProps } from './InputTextWithoutError'

interface IInputTextErrorProps extends IFieldErrorProps, IInputTextProps {}

function InputText(props: IInputTextErrorProps): JSX.Element {
  const {
    onChange,
    showError,
    additionalValidator,
    replacementErrorsMessages,
    ...inputProps
  } = props
  const validator = useCallback<IValidator>(
    (value, event) => {
      if (additionalValidator) return additionalValidator(value, event)
      return ''
    },
    [additionalValidator]
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
    <InputTextWithoutError
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      inputRef={ref as ForwardedRef<HTMLInputElement>}
      ref={null}
    />
  )
}

export default InputText
