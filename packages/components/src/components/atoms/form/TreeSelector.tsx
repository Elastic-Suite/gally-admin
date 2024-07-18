import React, { ForwardedRef, useCallback } from 'react'

import { IFieldErrorProps, IValidator, useFormError } from '../../../hooks'

import TreeSelectorWithoutError, {
  ITreeSelectorProps,
} from './TreeSelectorWithoutError'
interface ITreeSelectorErrorProps<Multiple extends boolean | undefined>
  extends IFieldErrorProps,
    ITreeSelectorProps<Multiple> {}

function TreeSelector<Multiple extends boolean | undefined>(
  props: ITreeSelectorErrorProps<Multiple>
): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props

  const validator = useCallback<IValidator>(
    (value: unknown, event) => {
      if (additionalValidator) {
        return additionalValidator(value, event)
      }
      if (inputProps.multiple) {
        if (inputProps.required && (value as unknown[]).length === 0) {
          return 'valueMissing'
        }
      } else if (inputProps.required && !value) {
        return 'valueMissing'
      }
      return ''
    },
    [additionalValidator, inputProps.multiple, inputProps.required]
  )

  const [{ ref, ...formErrorProps }] = useFormError(
    onChange,
    inputProps.value,
    showError,
    validator,
    inputProps.disabled
  )

  return (
    <TreeSelectorWithoutError
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref as ForwardedRef<HTMLInputElement>}
    />
  )
}

export default TreeSelector
