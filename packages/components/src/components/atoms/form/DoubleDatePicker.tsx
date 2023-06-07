import React, { ReactNode } from 'react'
import { Box, FormHelperText, Grid, InputLabel } from '@mui/material'
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation'
import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'
import dayjs, { Dayjs } from 'dayjs'

import IonIcon from '../IonIcon/IonIcon'

import DatePicker, { IDatePickerProps } from './DatePicker'
import FormControl from './FormControl'
import InfoTooltip from './InfoTooltip'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const CustomBox = styled(Box)(() => ({
  fontWeight: 400,
  fontFamily: 'var(--gally-font)',
}))

export interface IDoubleDatePickerValues {
  from: Dayjs | string | null
  to: Dayjs | string | null
}
export interface IDoubleDatePickerErrors {
  from: DateValidationError
  to: DateValidationError
}

export interface IDoubleDatePickerProps
  extends Omit<IDatePickerProps, 'value' | 'onChange' | 'onError'> {
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
  stringFormat?: boolean
}

function DoubleDatePicker(props: IDoubleDatePickerProps): JSX.Element {
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
    stringFormat = true,
    ...args
  } = props
  const { t } = useTranslation('common')

  function stringToDayJs(date: string): Dayjs | null {
    if (!date) {
      return null
    }
    return dayjs(date)
  }

  function onChangeFrom(date: Dayjs | Record<string, string>): void {
    const newFormatDate = stringFormat
      ? new Date((date as Record<string, string>).$d).toLocaleDateString(
          'en-EN'
        ) // TODO change en-EN with global variable of I18N
      : (date as Dayjs)
    onChange({ ...value, from: newFormatDate })
  }

  function onChangeTo(date: Dayjs | null): void {
    onChange({ ...value, to: date })
  }

  function onErrorFrom(reason: DateValidationError): void {
    onError({ ...errors, from: reason })
  }

  function onErrorTo(reason: DateValidationError): void {
    onError({ ...errors, to: reason })
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
        sx={{ marginTop: label ? '24px' : '0px' }}
      >
        <CustomBox sx={{ paddingRight: '20px' }}> {t('form.from')} </CustomBox>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid item xs>
            <DatePicker
              {...args}
              error={error}
              fullWidth={fullWidth}
              inputProps={inputProps}
              value={
                stringFormat
                  ? stringToDayJs(value?.from as string)
                  : (value?.from as Dayjs)
              }
              onChange={onChangeFrom}
              onError={onErrorFrom}
            />
          </Grid>
          <CustomBox sx={{ paddingRight: '20px', paddingLeft: '20px' }}>
            {t('form.to')}
          </CustomBox>
          <Grid item xs>
            <DatePicker
              {...args}
              error={error}
              fullWidth={fullWidth}
              inputProps={inputProps}
              value={
                stringFormat
                  ? stringToDayJs(value?.to as string)
                  : (value?.to as Dayjs)
              }
              onChange={onChangeTo}
              onError={onErrorTo}
            />
          </Grid>
        </LocalizationProvider>
      </Grid>
      {Boolean(helperText) && (
        <FormHelperText>
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

export default DoubleDatePicker
