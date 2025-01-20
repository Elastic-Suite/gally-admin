import React, {
  ChangeEvent,
  ForwardedRef,
  ReactNode,
  Ref,
  SyntheticEvent,
  forwardRef,
} from 'react'
import { FormHelperText, InputLabel } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { getFormValue } from '../../../services'

import IonIcon from '../IonIcon/IonIcon'

import FormControl from './FormControl'
import InfoTooltip from './InfoTooltip'
import { IUnstyledInputTextProps, Suffix, Wrapper } from './InputText.styled'
import { FirstInput, SecondInput } from './Range.styled'

export interface IRangeProps
  extends Omit<
    IUnstyledInputTextProps,
    'margin' | 'onChange' | 'placeholder' | 'value'
  > {
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  inputRef?: Ref<HTMLInputElement>
  helperText?: ReactNode
  helperIcon?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  placeholder?: string[]
  onChange?: (value: (string | number)[], event: SyntheticEvent) => void
  suffix?: ReactNode
  value: (string | number | null)[]
  dataTestId?: string
}

function RangeWithoutError(
  props: IRangeProps,
  ref?: ForwardedRef<HTMLInputElement>
): JSX.Element {
  const { t } = useTranslation('common')
  const {
    error,
    fullWidth,
    helperText,
    helperIcon,
    id,
    infoTooltip,
    inputProps,
    label,
    margin = 'none',
    onChange,
    placeholder = [],
    required,
    suffix,
    value,
    type = 'number',
    dataTestId,
    ...InputProps
  } = props
  const [placeholderFrom, placeholderTo] = placeholder
  const [valueFrom, valueTo] = value

  function handleChangeFrom(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { value } = event.target
    if (onChange) {
      onChange([getFormValue(value, props), valueTo], event)
    }
  }

  function handleChangeTo(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { value } = event.target
    if (onChange) {
      onChange([valueFrom, getFormValue(value, props)], event)
    }
  }

  return (
    <FormControl fullWidth={fullWidth} margin={margin}>
      {Boolean(label || infoTooltip) && (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      <Wrapper className="InputText__Wrapper">
        {t('form.from')}
        <FirstInput
          error={error}
          id={id}
          onChange={handleChangeFrom}
          required={required}
          {...InputProps}
          type={type}
          inputProps={{
            ...inputProps,
            max: valueTo,
            'data-testid': dataTestId ? `${dataTestId}First` : null,
          }}
          placeholder={placeholderFrom}
          value={valueFrom ? String(valueFrom) : ''}
          inputRef={ref}
        />
        {t('form.to')}
        <SecondInput
          error={error}
          onChange={handleChangeTo}
          required={required}
          {...InputProps}
          type={type}
          inputProps={{
            ...inputProps,
            min: valueFrom,
            'data-testid': dataTestId ? `${dataTestId}Second` : null,
          }}
          placeholder={placeholderTo}
          value={valueTo ? String(valueTo) : ''}
        />
        {Boolean(suffix) && <Suffix>{suffix}</Suffix>}
      </Wrapper>
      {Boolean(helperText) && (
        <FormHelperText
          error={error}
          data-testid={dataTestId ? `${dataTestId}ErrorMessage` : null}
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
    </FormControl>
  )
}

export default forwardRef<HTMLInputElement, IRangeProps>(RangeWithoutError)
