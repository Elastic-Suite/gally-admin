import React, { FormEvent, useState } from 'react'
import { styled } from '@mui/system'
import Chip from '../Chip/Chip'
import InputText from './InputText'
import { FormHelperText, InputLabel } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import InfoTooltip from './InfoTooltip'
import FormControl from './FormControl'
import { ITextFieldTagsForm } from '@elastic-suite/gally-admin-shared'

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
  background: theme.palette.colors.white,
  position: 'relative',
  gap: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: disabled ? '40px' : '54px',
  ...(disabled && {
    paddingTop: '1px',
    paddingBottom: '1px',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    borderColor: theme.palette.colors.neutral[300],
    color: theme.palette.colors.neutral['500'],
    WebkitTextFillColor: theme.palette.colors.neutral['500'],
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

const CustomCloseTagsByOperator = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: '-5px',
  top: '-5px',
  borderRadius: '50%',
  background: theme.palette.colors.neutral[600],
  color: 'white',
  display: 'flex',
  padding: theme.spacing(0.5),
  zIndex: '9',
  cursor: 'pointer',
}))

export interface ITextFieldTag extends Omit<ITextFieldTagsForm, 'options'> {
  value?: string[]
  onChange?: (value: string[]) => void
  onRemoveItem?: () => void
}

function TextFieldTags(props: ITextFieldTag): JSX.Element {
  const {
    value,
    onChange,
    onRemoveItem,
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
    key?: number,
    event?: FormEvent<HTMLFormElement>
  ): void | null {
    if (!value || !onChange) {
      return null
    }
    if (event) {
      event.preventDefault()
      if (val === undefined || val.trim() === '') {
        return null
      }
      const newTags = value.concat([val])
      setVal('')
      return onChange(newTags)
    }

    const newTags = value.filter((_, keyValue) => key !== keyValue)
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
        {onRemoveItem ? (
          <CustomCloseTagsByOperator onClick={onRemoveItem}>
            <IonIcon name="close" style={{ fontSize: 14, padding: '0px' }} />
          </CustomCloseTagsByOperator>
        ) : null}
        <CustomTags>
          {disabled || !value ? (
            <Chip disabled label={disabledValue} />
          ) : (
            value
              .filter((it) => it)
              .map((item: string, key: number) => {
                return disabled ? (
                  // eslint-disable-next-line react/no-array-index-key
                  <Chip disabled key={key} label={disabledValue} />
                ) : (
                  <Chip
                    // eslint-disable-next-line react/no-array-index-key
                    key={key}
                    label={item}
                    onDelete={(): void | null => manageTags(key)}
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
