import React, {
  ChangeEvent,
  ForwardedRef,
  ReactNode,
  SyntheticEvent,
  forwardRef,
} from 'react'
import {
  CheckboxProps,
  FormControlLabel,
  FormHelperText,
  Checkbox as MuiCheckbox,
} from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'

export interface ICheckboxWithoutErrorProps
  extends Omit<CheckboxProps, 'onChange' | 'onClick'> {
  label?: ReactNode
  list?: boolean
  onChange?: (checked: boolean, event: SyntheticEvent) => void
  onClick?: (event: SyntheticEvent) => void
  small?: boolean
  helperIcon?: string
  helperText?: ReactNode
  error?: boolean
  dataTestId?: string
}

function CheckboxWithoutError(
  props: ICheckboxWithoutErrorProps,
  ref?: ForwardedRef<HTMLInputElement>
): JSX.Element {
  const {
    error,
    helperIcon,
    helperText,
    disabled,
    label,
    list,
    onChange,
    onClick,
    small,
    dataTestId,
    ...checkboxProps
  } = props

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (onChange) {
      onChange(event.target.checked, event)
    }
  }

  return (
    <FormControlLabel
      componentsProps={{ typography: { variant: list ? 'caption' : 'body2' } }}
      control={
        <MuiCheckbox
          {...checkboxProps}
          inputRef={ref}
          onChange={handleChange}
          sx={{
            ...(Boolean(list) && {
              marginBottom: '-9px',
              marginTop: '-9px',
              fontSize: '12px',
            }),
            ...(Boolean(small) && {
              padding: 0,
              marginLeft: '6px',
              marginRight: '6px',
            }),
          }}
        />
      }
      onClick={onClick}
      disabled={disabled}
      label={
        <div>
          {label}
          {Boolean(helperText) && (
            <FormHelperText error={error}>
              {Boolean(helperIcon) && (
                <IonIcon
                  name={helperIcon}
                  style={{ fontSize: 18, marginRight: 2 }}
                />
              )}
              {helperText}
            </FormHelperText>
          )}
        </div>
      }
      sx={{
        ...(Boolean(small) && {
          marginLeft: '-6px',
        }),
      }}
      data-testid={dataTestId}
    />
  )
}

export default forwardRef(CheckboxWithoutError)
