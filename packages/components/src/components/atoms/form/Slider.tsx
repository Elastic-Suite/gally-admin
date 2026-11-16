import React, { ReactNode } from 'react'
import Box from '@mui/material/Box'
import { CustomIndicatorsNumber, Slide } from './Slider.styled'
import { FormHelperText, InputLabel, SliderProps } from '@mui/material'

import IonIcon from '../IonIcon/IonIcon'

import InfoTooltip from './InfoTooltip'
import { StyledFormControl } from './InputText.styled'
import { TestId, generateTestId } from '../../../utils/testIds'

export interface ISliderProps
  extends Omit<SliderProps, 'defaultValue' | 'onChange'> {
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  helperText?: ReactNode
  helperIcon?: string
  onChange?: (value: number) => void
  value: number
  width?: number
  required?: boolean
  componentId?: string
}

function Slider(props: ISliderProps): JSX.Element {
  const {
    error,
    fullWidth,
    helperText,
    helperIcon,
    infoTooltip,
    label,
    margin,
    onChange,
    required,
    value,
    width,
    componentId,
    min = 0,
    max = 100,
  } = props

  const indicatorNumber = min < 0 && max > 0 ? [min, 0, max] : [min, max]
  const toPercent = (number: number): number =>
    ((number - min) / (max - min)) * 100
  const origin = toPercent(Math.min(Math.max(0, min), max))
  const current = toPercent(value)

  function handleChange(_: Event, value: number): void {
    if (onChange) {
      onChange(value)
    }
  }
  return (
    <StyledFormControl
      error={error}
      fullWidth={fullWidth}
      margin={margin}
      variant="standard"
    >
      {Boolean(label || infoTooltip) && (
        <InputLabel shrink required={required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      <Box
        width={!fullWidth ? width : undefined}
        sx={{ marginTop: label ? '4px' : 0 }}
      >
        <CustomIndicatorsNumber>
          {indicatorNumber.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </CustomIndicatorsNumber>
        <Slide
          valueLabelDisplay="on"
          max={max}
          value={value}
          min={min}
          onChange={handleChange}
          style={
            {
              '--fill-left': `${Math.min(origin, current)}%`,
              '--fill-width': `${Math.abs(current - origin)}%`,
            } as React.CSSProperties
          }
          data-testid={generateTestId(TestId.SLIDER, componentId)}
        />
      </Box>
      {Boolean(helperText) && (
        <FormHelperText
          data-testid={generateTestId(TestId.HELPER_TEXT, componentId)}
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
    </StyledFormControl>
  )
}

Slider.defaultProps = {
  width: 376,
}

export default Slider
