import React, { ChangeEvent } from 'react'
import {
  FormHelperText,
  InputLabel,
  Switch as MuiSwitch,
  SwitchProps,
} from '@mui/material'
import { StyleFormControl } from './Switch.styled'

import IonIcon from '../IonIcon/IonIcon'
import InfoTooltip from './InfoTooltip'
import { TestId, generateTestId } from '../../../utils/testIds'

interface IProps extends Omit<SwitchProps, 'onChange'> {
  helperIcon?: string
  helperText?: string
  infoTooltip?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  onChange?: (value: boolean, event: ChangeEvent<HTMLInputElement>) => void
  componentId?: string
}

function Switch(props: IProps): JSX.Element {
  const {
    helperIcon,
    helperText,
    infoTooltip,
    label,
    margin,
    onChange,
    required,
    componentId,
    ...switchProps
  } = props

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange(event.target.checked, event)
  }

  return (
    <StyleFormControl
      fullWidth
      variant="standard"
      margin={margin}
      className="switch"
    >
      {label || infoTooltip ? (
        <InputLabel sx={{ maxWidth: '90%' }} required={required} shrink>
          {label ? label : null}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      ) : undefined}
      <MuiSwitch
        data-testid={generateTestId(TestId.SWITCH, componentId)}
        {...switchProps}
        onChange={handleChange}
        sx={
          label || infoTooltip ? { marginLeft: '-12px', marginTop: '20px' } : {}
        }
      />
      {Boolean(helperText) && (
        <FormHelperText
          data-testId={generateTestId(TestId.HELPER_TEXT, componentId)}
        >
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {helperText}
        </FormHelperText>
      )}
    </StyleFormControl>
  )
}

export default Switch
