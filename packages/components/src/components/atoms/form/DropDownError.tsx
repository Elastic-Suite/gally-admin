import React, {useRef} from 'react'

import { useFormError } from '../../../hooks'

import Dropdown, { IDropDownProps } from './DropDown'

// export function dropDownValidator(value: unknown): string | null {
//   console.log('value', value)
//   if(props.mult){

//   }
//   return ''
// }

interface IDropDownErrorProps<T> extends IDropDownProps<T> {
  showError?: boolean,
}

function DropdownError<T>(props: IDropDownErrorProps<T>): JSX.Element {
  const ref = useRef(null)
  const { onChange, showError, disabled, ...inputProps } = props
  const [formErrorProps] = useFormError(onChange, showError, (value) => {
    if(props.required){
      return !value || value.length === 0 ? 'valueMissing' : ''
    }
    return ''
  }, ref, disabled)
  return (
    <Dropdown
      {...inputProps}
      {...formErrorProps}
      error={inputProps?.error || formErrorProps?.error}
      helperIcon={inputProps?.helperIcon || formErrorProps?.helperIcon}
      helperText={inputProps?.helperText || formErrorProps?.helperText}
      ref={ref}
    />
  )
}

export default DropdownError
