import React, { FormEvent, ReactNode } from 'react'
import { styled } from '@mui/system'
import Chip from '../Chip/Chip'
import InputText from './InputText'
import { ITextFieldTags } from '@elastic-suite/gally-admin-shared'
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
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  helperText?: ReactNode
  helperIcon?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  required?: boolean
  size?: 'small' | 'medium' | undefined
}

export interface ITextFieldTag extends ITextFIeldTagsForm {
  data: ITextFieldTags
  onChange: (
    idItem: string,
    idTag: number | undefined,
    event?: FormEvent<HTMLFormElement>,
    value?: string
  ) => void
  value?: string
}

function TextFieldTags(props: ITextFieldTag): JSX.Element {
  const {
    data,
    onChange,
    value,
    disabled,
    required,
    error,
    fullWidth,
    helperText,
    helperIcon,
    label,
    margin,
    infoTooltip,
    size,
  } = props

  const isDisabled = Boolean(data.data.find((a) => a?.id === -1)) || disabled
  const CustomRoot = isDisabled
    ? CustomRootTextFieldTagsDisabled
    : CustomRootTextFieldTags

  return (
    <FormControl error={error} fullWidth={fullWidth} margin={margin}>
      {Boolean(label || infoTooltip) && (
        <div style={{ marginBottom: '24px' }}>
          <InputLabel shrink htmlFor={data.id} required={required}>
            {label}
            {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
          </InputLabel>
        </div>
      )}
      <CustomRoot>
        <CustomTags>
          {data.data.map((item) => {
            return isDisabled ? (
              item.id === -1 && (
                <Chip disabled key={item.id} label={item.label} />
              )
            ) : (
              <Chip
                key={item.id}
                label={item.label}
                onDelete={(): void => onChange(data.id, item.id)}
              />
            )
          })}
          {!isDisabled && (
            <form
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onSubmit={(e): void => onChange(data.id, undefined, e)}
            >
              <InputText
                value={value}
                size={size}
                sx={{
                  minWidth: 'auto',
                  width: '146px',
                  border: 'none',
                  background: 'inherit',
                  '&.MuiInputBase-root': { minHeight: 0, paddingLeft: '8px' },
                }}
                placeholder={data.label}
                onChange={(value): void =>
                  onChange(data.id, undefined, undefined, value as string)
                }
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
