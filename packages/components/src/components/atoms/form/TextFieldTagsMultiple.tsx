import React, { ReactNode, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { FormHelperText, InputLabel } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import InfoTooltip from './InfoTooltip'
import FormControl from './FormControl'
import TextFieldTags from './TextFieldTags'
import Button from '../buttons/Button'

import {
  IOptionsTags,
  ITransformedLimitations,
} from '@elastic-suite/gally-admin-shared'
import DropDown from './DropDown'

const CustomMultipleTextFieldsTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  flexDirection: 'column',
}))

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

const CustomSelectOperator = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  flexDirection: 'row',
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
  options: IOptionsTags[]
}

export interface ITextFieldTag extends ITextFIeldTagsForm {
  value: ITransformedLimitations
  onChange: (operator: string | string[], data?: string[] | string) => void
}

function TextFieldTagsMultiple(props: ITextFieldTag): JSX.Element {
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
    options,
  } = props

  const optionsListAvailable: (IOptionsTags & { disabled?: boolean })[] =
    options.map((item) => {
      if (value[item.value]) {
        return { ...item, disabled: true }
      }
      return item
    })

  const [optionDefault, setOptionDefault] = useState<undefined | IOptionsTags>()

  useEffect(() => {
    setOptionDefault(
      optionsListAvailable.find(
        (item) => optionDefault?.value === item.value && !item?.disabled
      ) ?? optionsListAvailable.find((item) => !item?.disabled)
    )
  }, [optionsListAvailable, optionDefault])

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
      <CustomMultipleTextFieldsTags>
        {disabled ? (
          <TextFieldTags disabledValue="disabled" disabled />
        ) : (
          Object.entries(value).map((item) => {
            const option = options.find((it) => it.value === item[0])
            const newOptionsList = options.map((it) => {
              if (value[it.value] && item[0] !== it.value) {
                return { ...it, disabled: true }
              }
              return it
            })
            return (
              <div key={item[0]}>
                <DropDown
                  onChange={(newOption): void =>
                    onChange(item[0], newOption as string)
                  }
                  value={option?.value}
                  options={newOptionsList}
                  sx={{ marginBottom: 1 }}
                />
                <div style={{ position: 'relative' }}>
                  <CustomCloseTagsByOperator
                    onClick={(): void => onChange(item[0])}
                  >
                    <IonIcon
                      name="close"
                      style={{ fontSize: 14, padding: '0px' }}
                    />
                  </CustomCloseTagsByOperator>
                  <TextFieldTags
                    onChange={(a): void => onChange(item[0], a)}
                    value={item[1]}
                    placeholder={option?.label}
                  />
                </div>
              </div>
            )
          })
        )}
        {optionDefault && !disabled ? (
          <CustomSelectOperator>
            <DropDown
              onChange={(newOption): void =>
                setOptionDefault(
                  optionsListAvailable.find((item) => item?.value === newOption)
                )
              }
              value={optionDefault?.value}
              options={optionsListAvailable}
            />
            <Button
              size="medium"
              onClick={(): void => onChange([optionDefault.value])}
            >
              Add
            </Button>
          </CustomSelectOperator>
        ) : null}
      </CustomMultipleTextFieldsTags>
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

export default TextFieldTagsMultiple
