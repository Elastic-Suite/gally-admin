import React, { ReactNode, SyntheticEvent } from 'react'
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Radio,
  RadioGroupProps,
  RadioGroup as RadioGrp,
} from '@mui/material'
import { IOption, IOptions } from '@elastic-suite/gally-admin-shared'
import IonIcon from '../IonIcon/IonIcon'
import InfoTooltip from '../../atoms/form/InfoTooltip'

export interface IRadioGroupProps extends Omit<RadioGroupProps, 'onChange'> {
  options: IOptions<unknown>
  onChange?: (value: string, event: SyntheticEvent) => void
  error?: boolean
  helperText?: ReactNode
  helperIcon?: string
  label?: string
  infoTooltip?: string
  required?: boolean
}

function RadioGroupWithoutError(props: IRadioGroupProps): JSX.Element {
  const {
    error,
    helperText,
    helperIcon,
    options,
    onChange,
    infoTooltip,
    label,
    defaultValue,
    ...radioGroupProps
  } = props
  const foundNameDefaultValue = options.find((element) => element.default)

  return (
    <FormControl variant="standard" margin="normal">
      {Boolean(label || infoTooltip) && (
        <InputLabel
          shrink
          style={{ position: 'relative' }}
          required={radioGroupProps.required}
        >
          {label}
          {Boolean(infoTooltip) && <InfoTooltip title={infoTooltip} />}
        </InputLabel>
      )}
      <RadioGrp
        {...radioGroupProps}
        onChange={(event, value): void => {
          onChange(value, event)
        }}
        defaultValue={
          defaultValue ||
          (radioGroupProps.defaultChecked ? foundNameDefaultValue?.value : null)
        }
      >
        {options.map((item: IOption<unknown>) => {
          return (
            <FormControlLabel
              disabled={item.disabled}
              key={item.label}
              value={item.value}
              control={<Radio />}
              label={item.label}
            />
          )
        })}
      </RadioGrp>
      {Boolean(helperText) && (
        <FormHelperText error={error} sx={{ marginTop: '-5px' }}>
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default RadioGroupWithoutError
