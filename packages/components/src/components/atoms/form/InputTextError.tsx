import React from 'react'

import { IFieldErrorProps, useFormError } from '../../../hooks'

import InputText, { IInputTextProps } from './InputText'

interface IInputTextErrorProps extends IFieldErrorProps, IInputTextProps {}

function InputTextError(props: IInputTextErrorProps): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props
  const [{ ref, ...formErrorProps }] = useFormError(
    onChange,
    inputProps.value,
    showError,
    additionalValidator,
    inputProps.disabled
  )
  return (
    <InputText
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      inputRef={ref}
      ref={null}
    />
  )
}

export default InputTextError
