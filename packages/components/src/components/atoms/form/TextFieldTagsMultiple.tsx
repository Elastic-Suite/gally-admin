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

  function transformedValue(tableau: ILimitations[]): ITransformedLimitations {
    const transformedObject: ITransformedLimitations = {}
    tableau.map((item) => {
      if (transformedObject[item.operator]?.[0]) {
        return transformedObject[item.operator].push(item.queryText as string)
      }
      return (transformedObject[item.operator] = [item.queryText as string])
    })
    return transformedObject
  }

  function unModifiedValue(obj: ITransformedLimitations): ILimitations[] {
    const tableau = [] as ILimitations[]
    for (const [key, item] of Object.entries(obj)) {
      item.length !== 0
        ? item.map((queryText) =>
            tableau.push({
              operator: key,
              queryText,
            })
          )
        : tableau.push({
            operator: key,
            queryText: null,
          })
    }
    return tableau
  }

  const modifiedValue = transformedValue(value)

  function onChangeModifiedValue(
    operator: string | string[],
    data?: string[] | string
  ): void {
    if (Array.isArray(operator)) {
      return onChange(
        unModifiedValue({ ...modifiedValue, [operator.toString()]: [] })
      )
    }

    if (typeof operator === 'string' && typeof data === 'string') {
      const newValue = { ...modifiedValue }
      newValue[data] = newValue[operator]
      delete newValue[operator]
      return onChange(unModifiedValue(newValue))
    }

    if (!data) {
      const newValue = { ...modifiedValue }
      delete newValue[operator as string]
      return onChange(unModifiedValue(newValue))
    }

    return onChange(
      unModifiedValue({
        ...modifiedValue,
        [operator as string]:
          (data as string[]).length > 1
            ? (data as string[]).filter((it) => it !== null)
            : (data as string[]),
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
      optionsListAvailable.find(
        (item) => operatorValue?.value === item.value && !item?.disabled
      ) ?? optionsListAvailable.find((item) => !item?.disabled)
    )
  }, [optionsListAvailable, operatorValue])

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
                    onChangeModifiedValue(key, newOption as string)
                  }
                  value={option?.value}
                  options={newOptionsList}
                  sx={{ marginBottom: 1 }}
                />
                <div style={{ position: 'relative' }}>
                  <CustomCloseTagsByOperator
                    onClick={(): void => onChangeModifiedValue(key)}
                  >
                    <IonIcon
                      name="close"
                      style={{ fontSize: 14, padding: '0px' }}
                    />
                  </CustomCloseTagsByOperator>
                  <TextFieldTags
                    fullWidth={fullWidth}
                    onChange={(a): void => onChangeModifiedValue(key, a)}
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
              onClick={(): void => onChangeModifiedValue([operatorValue.value])}
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
