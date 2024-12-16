import React, { ForwardedRef, useCallback } from 'react'

import {
  IFieldErrorProps,
  IOnChange,
  IValidator,
  useFormError,
} from '../../../hooks'

import RadioGroupWithoutError, {
  IRadioGroupProps,
} from './RadioGroupWithoutError'
import InputTextWithoutError from './InputTextWithoutError'

interface IRadioGroupErrorProps extends IFieldErrorProps, IRadioGroupProps {
  required?: boolean
}

function RadioGroup(props: IRadioGroupErrorProps): JSX.Element {
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
      if (inputProps.required && !value) return 'valueMissing'
      return ''
    },
    [additionalValidator, inputProps.required]
  )

  const [{ ref, ...formErrorProps }] = useFormError(
    onChange as IOnChange,
    inputProps.value,
    showError,
    validator,
    false,
    replacementErrorsMessages
  )

  return (
    <>
      <RadioGroupWithoutError
        {...inputProps}
        {...formErrorProps}
        error={inputProps?.error || formErrorProps?.error}
        helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
        helperText={inputProps?.helperText || formErrorProps?.helperText}
      />
      <InputTextWithoutError
        style={{ display: 'none' }}
        inputRef={ref as ForwardedRef<HTMLInputElement>}
      />
    </>
  )
}

export default RadioGroup
