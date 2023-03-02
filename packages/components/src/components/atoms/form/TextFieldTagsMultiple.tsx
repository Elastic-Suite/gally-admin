import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { FormHelperText, InputLabel } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import InfoTooltip from './InfoTooltip'
import FormControl from './FormControl'
import TextFieldTags from './TextFieldTags'
import Button from '../buttons/Button'

import {
  ILimitations,
  IOptionsTags,
  ITextFieldTagsForm,
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

export interface ITextFieldTagsMultipleProps
  extends Omit<ITextFieldTagsForm, 'size' | 'placeholder'> {
  value: ILimitations[]
  onChange: (value: ILimitations[]) => void
}

function TextFieldTagsMultiple(
  props: ITextFieldTagsMultipleProps
): JSX.Element {
  const {
    value,
    onChange,
    disabledValue,
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

  function transformedValue(list: ILimitations[]): ITransformedLimitations {
    const transformedObject: ITransformedLimitations = {}
    list.forEach((item) => {
      if (transformedObject[item.operator]) {
        transformedObject[item.operator].push(item.queryText as string)
      } else {
        transformedObject[item.operator] = [item.queryText as string]
      }
    })
    return transformedObject
  }

  function unModifiedValue(obj: ITransformedLimitations): ILimitations[] {
    const list = [] as ILimitations[]
    for (const [key, item] of Object.entries(obj)) {
      item.length !== 0
        ? item.map((queryText) =>
            list.push({
              operator: key,
              queryText,
            })
          )
        : list.push({
            operator: key,
            queryText: null,
          })
    }
    return list
  }

  const modifiedValue = transformedValue(value)

  function addItem(operator: string): void {
    onChange(unModifiedValue({ ...modifiedValue, [operator]: [] }))
  }

  function removeItem(operator: string): void {
    const newValue = { ...modifiedValue }
    delete newValue[operator as string]
    onChange(unModifiedValue(newValue))
  }

  function updateOperator(oldOperator: string, newOperator: string): void {
    const newValue = { ...modifiedValue }
    newValue[newOperator] = newValue[oldOperator]
    delete newValue[oldOperator]
    return onChange(unModifiedValue(newValue))
  }

  function updateValue(operator: string, data: string[]): void {
    return onChange(
      unModifiedValue({
        ...modifiedValue,
        [operator]: data.filter((it) => it !== null),
      })
    )
  }

  const optionsListAvailable: (IOptionsTags & { disabled?: boolean })[] =
    options.map((item) =>
      modifiedValue[item.value] ? { ...item, disabled: true } : item
    )

  const [operatorValue, setOperatorValue] = useState<undefined | IOptionsTags>()

  useEffect(() => {
    setOperatorValue(
      (operatorValue) =>
        optionsListAvailable.find(
          (item) => operatorValue?.value === item.value && !item?.disabled
        ) ?? optionsListAvailable.find((item) => !item?.disabled)
    )
  }, [optionsListAvailable])

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
          <TextFieldTags disabledValue={disabledValue} disabled />
        ) : (
          Object.entries(modifiedValue).map(([key, value]) => {
            const option = options.find((it) => it.value === key)
            const newOptionsList = options.map((it) => {
              if (modifiedValue[it.value] && key !== it.value) {
                return { ...it, disabled: true }
              }
              return it
            })
            return (
              <div key={key}>
                <DropDown
                  onChange={(newOption): void =>
                    updateOperator(key, newOption as string)
                  }
                  value={option?.value}
                  options={newOptionsList}
                  sx={{ marginBottom: 1 }}
                />
                <div style={{ position: 'relative' }}>
                  <CustomCloseTagsByOperator
                    onClick={(): void => removeItem(key)}
                  >
                    <IonIcon
                      name="close"
                      style={{ fontSize: 14, padding: '0px' }}
                    />
                  </CustomCloseTagsByOperator>
                  <TextFieldTags
                    fullWidth={fullWidth}
                    onChange={(value): void => updateValue(key, value)}
                    value={value}
                    placeholder={option?.label}
                  />
                </div>
              </div>
            )
          })
        )}
        {operatorValue && !disabled ? (
          <CustomSelectOperator>
            <DropDown
              onChange={(newOption): void =>
                setOperatorValue(
                  optionsListAvailable.find((item) => item?.value === newOption)
                )
              }
              value={operatorValue?.value}
              options={optionsListAvailable}
            />
            <Button
              size="medium"
              onClick={(): void => addItem(operatorValue.value)}
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
