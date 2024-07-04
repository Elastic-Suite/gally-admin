import React, { useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { FormHelperText, IconButton, InputLabel } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import InfoTooltip from './InfoTooltip'
import FormControl from './FormControl'
import TextFieldTagsError from './TextFieldTagsError'
import Button from '../buttons/Button'

import {
  IOptionsTags,
  ISearchLimitations,
  ITextFieldTagsForm,
  ITransformedLimitations,
} from '@elastic-suite/gally-admin-shared'
import DropDownWithoutError from './DropDownWithoutError'
import { useTranslation } from 'next-i18next'

const CustomMultipleTextFieldsTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),
  flexDirection: 'column',
}))

const CustomSelectOperator = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  flexDirection: 'row',
}))

export interface ITextFieldTagsMultipleProps
  extends Omit<ITextFieldTagsForm, 'size' | 'placeholder'> {
  value: ISearchLimitations[]
  onChange?: (value: ISearchLimitations[]) => void
  showError?: boolean
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
    showError,
  } = props

  const { t } = useTranslation('common')

  function transformedValue(
    list: ISearchLimitations[]
  ): ITransformedLimitations {
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

  function unModifiedValue(obj: ITransformedLimitations): ISearchLimitations[] {
    const list = [] as ISearchLimitations[]
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

  const addItem = useCallback(
    (operator: string) => {
      if (onChange)
        onChange(unModifiedValue({ ...modifiedValue, [operator]: [] }))
    },
    [onChange, modifiedValue]
  )

  function removeItem(operator: string): void {
    const newValue = { ...modifiedValue }
    delete newValue[operator as string]
    if (onChange) onChange(unModifiedValue(newValue))
  }

  function updateOperator(oldOperator: string, newOperator: string): void {
    const newValue = { ...modifiedValue }
    newValue[newOperator] = newValue[oldOperator]
    delete newValue[oldOperator]
    if (onChange) return onChange(unModifiedValue(newValue))
  }

  function updateValue(operator: string, data: string[]): void {
    if (onChange)
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
    if (
      !disabled &&
      optionsListAvailable.filter((opt) => opt.disabled).length === 0
    ) {
      addItem(optionsListAvailable.filter((opt) => !opt.disabled)[0].value)
    } else {
      setOperatorValue(
        (operatorValue) =>
          optionsListAvailable.find(
            (item) => operatorValue?.value === item.value && !item?.disabled
          ) ?? optionsListAvailable.find((item) => !item?.disabled)
      )
    }
  }, [optionsListAvailable, addItem, disabled])

  return (
    <FormControl error={error} fullWidth={fullWidth} margin={margin}>
      {Boolean(label || infoTooltip) && (
        <div style={{ marginBottom: '4px' }}>
          <InputLabel shrink required={required}>
            {label}
            {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
          </InputLabel>
        </div>
      )}
      <CustomMultipleTextFieldsTags>
        {disabled ? (
          <TextFieldTagsError
            value={[]}
            disabledValue={disabledValue}
            disabled
          />
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
              <div
                key={key}
                style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}
              >
                <div
                  style={{
                    padding: '16px',
                    border: '1px solid #E2E6F3',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                  }}
                >
                  <DropDownWithoutError
                    required
                    onChange={(newOption): void =>
                      updateOperator(key, newOption as string)
                    }
                    value={option?.value}
                    options={newOptionsList}
                    sx={{ marginBottom: 1 }}
                  />
                  <TextFieldTagsError
                    required
                    showError={showError}
                    withCleanButton
                    fullWidth={fullWidth}
                    onChange={(value): void => updateValue(key, value)}
                    value={value}
                  />
                </div>
                {optionsListAvailable.filter((opt) => opt.disabled).length >
                  1 && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={(): void => removeItem(key)}>
                      <IonIcon
                        style={{ fontSize: '18px', color: '#424880' }}
                        name="trash-outline"
                      />
                    </IconButton>
                  </div>
                )}
              </div>
            )
          })
        )}
        {operatorValue && !disabled ? (
          <CustomSelectOperator>
            <Button
              display="secondary"
              size="medium"
              onClick={(): void =>
                addItem(
                  optionsListAvailable.filter((opt) => !opt.disabled)[0].value
                )
              }
              endIcon={<IonIcon name="add" style={{ fontSize: 24 }} />}
            >
              {t('Add')}
            </Button>
          </CustomSelectOperator>
        ) : null}
      </CustomMultipleTextFieldsTags>
      {Boolean(helperText) && (
        <FormHelperText error={error}>
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

export default TextFieldTagsMultiple
