import React from 'react'

import { IFieldErrorProps, useFormError } from '../../../hooks'

import TreeSelector, { ITreeSelectorProps } from './TreeSelector'
interface ITreeSelectorErrorProps<Multiple extends boolean | undefined>
  extends IFieldErrorProps,
    ITreeSelectorProps<Multiple> {}

function TreeSelectorError<Multiple extends boolean | undefined>(
  props: ITreeSelectorErrorProps<Multiple>
): JSX.Element {
  const { onChange, showError, additionalValidator, ...inputProps } = props
  const [{ ref, ...formErrorProps }] = useFormError(
    onChange,
    inputProps.value,
    showError,
    (value: unknown, event) => {
      if (inputProps.multiple) {
        if (inputProps.required && (value as unknown[]).length === 0) {
          return 'valueMissing'
        }
      } else if (inputProps.required && !value) {
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
    <TreeSelector
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref}
    />
  )
}

export default TreeSelectorError
