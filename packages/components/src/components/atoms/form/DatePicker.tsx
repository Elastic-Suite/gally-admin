import React, { ChangeEvent, ComponentType, Ref, SyntheticEvent } from 'react'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import {
  PickersDay,
  PickersDayProps,
  pickersDayClasses,
} from '@mui/x-date-pickers/PickersDay'
import { DateValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useDateValidation'
import { styled } from '@mui/system'

import IonIcon from '../IonIcon/IonIcon'

import InputText, { IInputTextProps } from './InputText'

import { useTranslation } from 'next-i18next'

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

function DatePicker(props: IDatePickerProps): JSX.Element {
  const { t } = useTranslation('common')
  const { value, onChange, onError, ...args } = props

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
      onChange={onChange}
      onError={onError}
      renderDay={renderWeekPickerDay}
      components={{
        OpenPickerIcon: EndIcon,
        SwitchViewIcon: ShowIcon,
      }}
      renderInput={(params): JSX.Element => {
        const { InputProps, inputProps, ...rest } = params
        const { onChange, readOnly, type, value } = inputProps
        return (
          <InputText
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
          />
        )
      }}
    />
  )
}

export default DatePicker
