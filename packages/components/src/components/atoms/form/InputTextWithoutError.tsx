import React, {
  ChangeEvent,
  ForwardedRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  SyntheticEvent,
  forwardRef,
} from 'react'
import { FormHelperText, InputLabel } from '@mui/material'

import { getFormValue } from '../../../services'

import IonIcon from '../IonIcon/IonIcon'

import InfoTooltip from './InfoTooltip'
import {
  IUnstyledInputTextProps,
  InputTextStyled,
  StyledFormControl,
  Suffix,
  Wrapper,
} from './InputText.styled'

import { TestId, generateTestId } from '../../../utils/testIds'

export interface IInputTextProps
  extends Omit<
      IUnstyledInputTextProps,
      'margin' | 'onChange' | 'onKeyUp' | 'onKeyDown' | 'onBlur' | 'onFocus'
    >,
    Pick<
      HTMLAttributes<HTMLInputElement>,
      'onKeyUp' | 'onKeyDown' | 'onBlur' | 'onFocus'
    > {
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  inputRef?: Ref<HTMLInputElement>
  label?: ReactNode
  margin?: 'none' | 'dense' | 'normal'
  helperText?: ReactNode
  helperIcon?: string
  onChange?: (value: string | number, event: SyntheticEvent) => void
  suffix?: ReactNode
  requiredLabel?: boolean
  componentId?: string
}

function InputTextWithoutError(
  props: IInputTextProps,
  ref?: ForwardedRef<HTMLDivElement>
): JSX.Element {
  const {
    error,
    fullWidth,
    helperText,
    helperIcon,
    id,
    infoTooltip,
    label,
    margin,
    onChange,
    required,
    suffix,
    value,
    requiredLabel,
    componentId,
    inputProps,
    ...InputProps
  } = props

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { value } = event.target
    if (onChange) {
      onChange(getFormValue(value, props), event)
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
        <InputLabel shrink htmlFor={id} required={requiredLabel || required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      <Wrapper className="InputText__Wrapper">
        <InputTextStyled
          id={id}
          onChange={handleChange}
          required={required}
          ref={ref}
          value={(value ?? '').toString()}
          inputProps={{
            'data-testid': generateTestId(TestId.INPUT_TEXT, componentId),
            ...inputProps,
          }}
          {...InputProps}
        />
        {Boolean(suffix) && <Suffix>{suffix}</Suffix>}
      </Wrapper>
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

export default forwardRef<HTMLDivElement, IInputTextProps>(
  InputTextWithoutError
)
