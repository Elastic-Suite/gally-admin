import React, { FormEvent, ReactNode, useState } from 'react'
import { styled } from '@mui/system'
import Chip from '../Chip/Chip'
import InputText from './InputText'
import { FormHelperText, InputLabel } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import InfoTooltip from './InfoTooltip'
import FormControl from './FormControl'

const CustomRootTextFieldTags = styled('div')(({ theme }) => ({
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
}))

const CustomRootTextFieldTagsDisabled = styled(CustomRootTextFieldTags)(
  ({ theme }) => ({
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    borderColor: theme.palette.colors.neutral[300],
    color: theme.palette.colors.neutral[500],
    background: theme.palette.colors.neutral[300],
    width: 'auto',
    maxWidth: '350px',
    minWidth: '180px',
  })
)

const CustomTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
}))

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
  data: string[]
  onChange: (data: string[], event?: FormEvent<HTMLFormElement>) => void
}

function TextFieldTags(props: ITextFieldTag): JSX.Element {
  const {
    data,
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

  const CustomRoot = disabled
    ? CustomRootTextFieldTagsDisabled
    : CustomRootTextFieldTags

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
      const newTags = data.concat([val])
      setVal('')
      return onChange(newTags, event)
    }

    const newTags = data.filter((item) => item !== tag)
    return onChange(newTags, event)
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
      <CustomRoot>
        <CustomTags>
          {disabled ? (
            <Chip disabled label={disabledValue} />
          ) : (
            data.map((item: string) => {
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
            <form
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onSubmit={(e): void | null => manageTags(undefined, e)}
            >
              <InputText
                value={val}
                size={size}
                sx={{
                  minWidth: 'auto',
                  width: '146px',
                  border: 'none',
                  background: 'inherit',
                  '&.MuiInputBase-root': { minHeight: 0, paddingLeft: '8px' },
                }}
                placeholder={placeholder}
                onChange={(value): void => setVal(value as string)}
              />
            </form>
          )}
        </CustomTags>
      </CustomRoot>
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
