import React, { useRef } from 'react'

import { useFormError } from '../../../hooks'

import TreeSelector, { ITreeSelectorProps } from './TreeSelector'
import { ITreeItem } from '@elastic-suite/gally-admin-shared'

interface ITreeSelectorErrorProps<Multiple extends boolean | undefined> extends ITreeSelectorProps<Multiple>{
  showError?: boolean,
}

function TreeSelectorError<Multiple extends boolean | undefined>(
  props: ITreeSelectorErrorProps<Multiple>,
): JSX.Element {
  const { onChange, showError, disabled, ...inputProps } = props
  const ref = useRef(null)
  const [formErrorProps] = useFormError(
    onChange,
    showError,
    (value: ITreeItem[]) => {
      if(props.multiple){
        if(props.required && value.length === 0) {
          return 'valueMissing'
        }
      } else {
        if(props.required && !value) {
          return 'valueMissing'
        }
      }
      return ''
    },
    ref,
    disabled,
  )

  return (
    <TreeSelector
      {...inputProps}
      disabled={disabled}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref}
    />
  )
}

export default TreeSelectorError
