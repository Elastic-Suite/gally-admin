import React, { forwardRef, useRef } from 'react'

import { useFormError } from '../../../hooks'

import InputText, { IInputTextProps } from './InputText'

interface IInputTextErrorProps extends IInputTextProps {
  showError?: boolean
  displayError?: boolean
}

function InputTextError(
  props: IInputTextErrorProps
): JSX.Element {
  const ref = useRef(null)
  const { onChange, showError, ...inputProps } = props
  const [formErrorProps] = useFormError(
    onChange,
    inputProps.value,
    showError,
    undefined,
    ref,
    undefined,
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
