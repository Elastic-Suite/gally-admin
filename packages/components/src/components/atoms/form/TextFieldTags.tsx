import React, { FormEvent, ReactNode, useState } from 'react'
import { styled } from '@mui/system'
import Chip from '../Chip/Chip'
import InputText from './InputText'
import { FormHelperText, InputLabel } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import InfoTooltip from './InfoTooltip'
import FormControl from './FormControl'

const customRootTextFieldTagsProps = ['disabled']
const CustomRootTextFieldTags = styled('div', {
  shouldForwardProp: (prop: string) =>
    !customRootTextFieldTagsProps.includes(prop),
})<{ disabled?: boolean }>(({ theme, disabled }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingRight: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.colors.neutral[600],
  width: '350px',
  boxSizing: 'border-box',
  gap: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '54px',
  ...(disabled && {
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderColor: theme.palette.colors.neutral[300],
    color: theme.palette.colors.neutral[500],
    background: theme.palette.colors.neutral[300],
    width: 'auto',
    maxWidth: '350px',
    minWidth: '180px',
  }),
}))

const CustomTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
}))

const CustomFormTextFieldTags = styled('form')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})

const CustomInputTextTextFieldTags = styled(InputText)({
  minWidth: 'auto',
  width: '146px',
  border: 'none',
  background: 'inherit',
  '&.MuiInputBase-root': { minHeight: 0, paddingLeft: '8px' },
})

export interface ITextFIeldTagsForm {
  disabled?: boolean
  disabledValue?: string
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  helperText?: ReactNode
  helperIcon?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  required?: boolean
  size?: 'small' | 'medium' | undefined
  placeholder?: string
}

export interface ITextFieldTag extends ITextFIeldTagsForm {
  value: string[]
  onChange: (value: string[]) => void
}

function TextFieldTags(props: ITextFieldTag): JSX.Element {
  const {
    value,
    onChange,
    disabled,
    required,
    error,
    fullWidth,
    helperText,
    helperIcon,
    label,
    margin,
    infoTooltip,
    placeholder,
    size,
    disabledValue,
  } = props

  const [val, setVal] = useState<string>('')

  function manageTags(
    tag?: string,
    event?: FormEvent<HTMLFormElement>
  ): void | null {
    if (event) {
      event.preventDefault()
      if (val === undefined || val.trim() === '') {
        return null
      }
      const newTags = value.concat([val])
      setVal('')
      return onChange(newTags)
    }

    const newTags = value.filter((item) => item !== tag)
    return onChange(newTags)
  }

  return (
    <FormControl error={error} fullWidth={fullWidth} margin={margin}>
      {Boolean(label || infoTooltip) && (
        <div style={{ marginBottom: '24px' }}>
          <InputLabel shrink required={required}>
            {label}
            {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
          </InputLabel>
        </div>
      )}
      <CustomRootTextFieldTags disabled={disabled}>
        <CustomTags>
          {disabled ? (
            <Chip disabled label={disabledValue} />
          ) : (
            value.map((item: string) => {
              return disabled ? (
                <Chip disabled key={item} label={disabledValue} />
              ) : (
                <Chip
                  key={item}
                  label={item}
                  onDelete={(): void | null => manageTags(item)}
                />
              )
            })
          )}
          {!disabled && (
            <CustomFormTextFieldTags
              onSubmit={(e): void | null => manageTags(undefined, e)}
            >
              <CustomInputTextTextFieldTags
                value={val}
                size={size}
                placeholder={placeholder}
                onChange={(value): void => setVal(value as string)}
              />
            </CustomFormTextFieldTags>
          )}
        </CustomTags>
      </CustomRootTextFieldTags>
      {Boolean(helperText) && (
        <FormHelperText error={error}>
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon as string}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default TextFieldTags
