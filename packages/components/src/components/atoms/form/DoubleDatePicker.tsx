import React, { ReactNode, RefObject, forwardRef } from 'react'
import { Box, FormHelperText, Grid, InputLabel } from '@mui/material'
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation'
import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'

import IonIcon from '../IonIcon/IonIcon'

import DatePicker, { IDatePickerProps } from './DatePicker'
import FormControl from './FormControl'
import InfoTooltip from './InfoTooltip'

const CustomBox = styled(Box)(({ theme }) => ({
  fontWeight: 500,
  fontFamily: 'var(--gally-font)',
  fontSize: '14px',
  lineHeight: '20px',
  color: theme.palette.colors.neutral[600],
}))

export interface IDoubleDatePickerValues {
  fromDate: Date | string | null
  toDate: Date | string | null
}
export interface IDoubleDatePickerErrors {
  from: DateValidationError
  to: DateValidationError
}

export interface IDoubleDatePickerProps
  extends Omit<IDatePickerProps, 'value' | 'onChange' | 'onError' | 'ref'> {
  value?: IDoubleDatePickerValues
  onChange?: (values: IDoubleDatePickerValues) => void
  onError?: (reasons: IDoubleDatePickerErrors) => void
  error?: boolean
  errors?: IDoubleDatePickerErrors
  fullWidth?: boolean
  infoTooltip?: string
  label?: ReactNode
  margin?: 'none' | 'dense' | 'normal'
  helperText?: ReactNode
  helperIcon?: string
}

function DoubleDatePicker(
  props: IDoubleDatePickerProps,
  ref?: RefObject<HTMLInputElement>
): JSX.Element {
  const {
    value,
    error,
    errors,
    fullWidth,
    helperText,
    helperIcon,
    id,
    infoTooltip,
    inputProps,
    label,
    margin,
    onChange,
    onError,
    required,
    ...args
  } = props
  const { t } = useTranslation('common')

  function onChangeFrom(date: Date | string): void {
    onChange({ ...value, fromDate: date })
  }

  function onChangeTo(date: Date | string): void {
    onChange({ ...value, toDate: date })
  }

  function onErrorFrom(reason: DateValidationError): void {
    if (onError) {
      onError({ ...errors, from: reason })
    }
  }

  function onErrorTo(reason: DateValidationError): void {
    if (onError) {
      onError({ ...errors, to: reason })
    }
  }

  return (
    <FormControl error={error} fullWidth={fullWidth} margin={margin}>
      {Boolean(label || infoTooltip) && (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      <Grid
        justifyContent="flex-start"
        alignItems="center"
        container
        sx={{ marginTop: label ? '4px' : '0px' }}
      >
        <CustomBox sx={{ paddingRight: '20px' }}> {t('form.from')} </CustomBox>
        <Grid item xs>
          <DatePicker
            {...args}
            required={required}
            error={error}
            fullWidth={fullWidth}
            inputProps={inputProps}
            value={value?.fromDate}
            onChange={onChangeFrom}
            onError={onErrorFrom}
            ref={ref}
          />
        </Grid>
        <CustomBox sx={{ paddingRight: '20px', paddingLeft: '20px' }}>
          {t('form.to')}
        </CustomBox>
        <Grid item xs>
          <DatePicker
            {...args}
            required={required}
            error={error}
            fullWidth={fullWidth}
            inputProps={inputProps}
            value={value?.toDate}
            onChange={onChangeTo}
            onError={onErrorTo}
          />
        </Grid>
      </Grid>
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
    </FormControl>
  )
}

export default forwardRef(DoubleDatePicker)
