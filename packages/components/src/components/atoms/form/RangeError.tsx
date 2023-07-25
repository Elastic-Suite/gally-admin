import React from 'react'

import { useFormError } from '../../../hooks'

import Range, { IRangeProps } from './Range'

interface IRangeErrorProps extends IRangeProps {
  showError?: boolean
}

function RangeError(props: IRangeErrorProps): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const [formErrorProps] = useFormError(onChange, showError)
  return (
    <Range
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
    />
  )
}

export default RangeError
