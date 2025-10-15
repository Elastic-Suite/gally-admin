import React, {
  ChangeEvent,
  ComponentType,
  ForwardedRef,
  Ref,
  SyntheticEvent,
  forwardRef,
} from 'react'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import {
  PickersDay,
  PickersDayProps,
  pickersDayClasses,
} from '@mui/x-date-pickers/PickersDay'
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation'
import { styled } from '@mui/system'

import IonIcon from '../IonIcon/IonIcon'

import InputTextWithoutError, { IInputTextProps } from './InputTextWithoutError'

import { useTranslation } from 'next-i18next'
import { createUTCDateSafe } from '@elastic-suite/gally-admin-shared'
import { isValid } from 'date-fns'

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})<PickersDayProps<Date>>(({ theme }) => ({
  fontWeight: 500,
  [`&&.${pickersDayClasses.selected}`]: {
    backgroundColor: theme.palette.colors.primary['400'],
    color: 'white',
  },
  [`&&.${pickersDayClasses.selected}, &:hover, &:focus`]: {
    backgroundColor: theme.palette.colors.primary['400'],
    color: 'white',
  },
})) as ComponentType<PickersDayProps<Date>>

export interface IDatePickerProps
  extends Omit<IInputTextProps, 'value' | 'onChange' | 'onError'> {
  value: Date | string | null
  onChange: (value: Date | string | null) => void
  onError?: (reason: DateValidationError, value: Date) => void
  componentId?: string
}

function EndIcon(): JSX.Element {
  return (
    <IonIcon name="calendar-outline" style={{ fontSize: 18, padding: '0px' }} />
  )
}

function ShowIcon(): JSX.Element {
  return (
    <IonIcon
      name="chevron-down-outline"
      style={{ fontSize: 18, padding: '0px' }}
    />
  )
}

function DatePickerWithoutError(
  props: IDatePickerProps,
  ref?: ForwardedRef<HTMLInputElement>
): JSX.Element {
  const { t } = useTranslation('common')
  const { value, onChange, onError, componentId, ...args } = props

  function onChangeDatePicker(date: Date | string): void {
    // When date is an object, we format the date to ignore the timezone
    // This prevents dates close to 00:00:00 to be considered the previous day
    // For Example "Sat Oct 19 2030 00:00:00 GMT+0200" could be formatted as "Fri Oct 18"
    const utcDate =
      date instanceof Date && isValid(date) ? createUTCDateSafe(date) : ''
    onChange(utcDate)
  }

  const renderWeekPickerDay = (
    _: string,
    __: Array<Date | null>,
    pickersDayProps: PickersDayProps<Date>
  ): JSX.Element => {
    return <CustomPickersDay {...pickersDayProps} />
  }

  return (
    <MuiDatePicker
      value={value}
      onChange={onChangeDatePicker}
      onError={onError}
      renderDay={renderWeekPickerDay}
      components={{
        OpenPickerIcon: EndIcon,
        SwitchViewIcon: ShowIcon,
      }}
      inputRef={ref}
      renderInput={(params): JSX.Element => {
        const { InputProps, inputProps, ...rest } = params
        const { onChange, readOnly, type, value } = inputProps
        return (
          <InputTextWithoutError
            {...InputProps}
            {...rest}
            {...args}
            onChange={(_: string | number, event: SyntheticEvent): void =>
              onChange(event as ChangeEvent<HTMLInputElement>)
            }
            placeholder={t('date.placeholder')}
            readOnly={readOnly}
            ref={params.ref as Ref<HTMLDivElement>}
            type={type}
            value={value}
            componentId={componentId}
          />
        )
      }}
    />
  )
}

export default forwardRef(DatePickerWithoutError)
