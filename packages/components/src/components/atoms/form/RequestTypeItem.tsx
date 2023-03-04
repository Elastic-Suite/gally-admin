import React from 'react'
import { styled } from '@mui/system'

import {
  ILimitationsTypes,
  IRequestType,
  IRequestTypesOptions,
  IOptionsTags,
  ILimitations,
} from '@elastic-suite/gally-admin-shared'

import TextFieldTagsMultiple from './TextFieldTagsMultiple'

import Checkbox from './Checkbox'
import { IconButton } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'

const CustomRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
})

const CustomItem = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  alignItems: 'start',
}))

const CustomLabel = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  fontFamily: 'var(--gally-font)',
  fontSize: theme.spacing(1.5),
  fontWeight: '600',
  lineHeight: '18px',
}))

const CustomDataLimitations = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  alignItems: 'center',
}))

export interface ITextFieldTagssss {
  value: IRequestType
  onChange: (value: IRequestType) => void
  options: IOptionsTags[]
  limitationsTypes: ILimitationsTypes[]
  requestTypesOptions: IRequestTypesOptions[]
}

function TextFieldTagsItem(props: ITextFieldTagssss): JSX.Element {
  const { value, onChange, options, limitationsTypes, requestTypesOptions } =
    props

  function onChangeVal(
    idItem: IRequestTypesOptions[] | ILimitations[],
    val?: boolean | string
  ) {
    if (Array.isArray(idItem) && typeof val === 'boolean') {
      const newData = value.requestTypes.map((item) => {
        if (
          item.requestType ===
          (idItem as IRequestTypesOptions[]).find(
            (it) => it.value === item.requestType
          )?.value
        ) {
          return { ...item, applyToAll: !item.applyToAll }
        }
        return item
      })
      return onChange({ ...value, requestTypes: newData })
    }

    if (Array.isArray(idItem) && typeof val === 'string') {
      return onChange({ ...value, [val]: idItem })
    }

    if (!val) {
      const newData = value.requestTypes.filter(
        (item) =>
          item.requestType !==
          (idItem as IRequestTypesOptions[]).find(
            (it) => it.value === item.requestType
          )?.value
      )

      return onChange({ ...value, requestTypes: newData })
    }
  }

  return (
    <CustomRoot>
      {limitationsTypes.map((item) => {
        const requestTypeOption = requestTypesOptions.filter(
          (it) =>
            it.limitation_type === item.value &&
            value.requestTypes.find((its) => its.requestType === it.value)
        )
        if (requestTypeOption.length !== 0) {
          const concatLabel = requestTypeOption.map((it) => it.label)
          const isApplyToAll = value.requestTypes.find(
            (it) =>
              it.requestType ===
              requestTypeOption.find((its) => its.value === it.requestType)
                ?.value
          )?.applyToAll

          const limitationsData = value[item.value + 'Limitations']

          return (
            <CustomItem key={item.label}>
              <CustomLabel>{concatLabel.join(' / ')}</CustomLabel>
              <div style={{ marginTop: '-12px' }}>
                <Checkbox
                  checked={isApplyToAll}
                  label={item.labelAll}
                  onChange={(val: boolean): void =>
                    onChangeVal(requestTypeOption, val)
                  }
                />
              </div>
              <CustomDataLimitations>
                {item.value === 'search' && (
                  <TextFieldTagsMultiple
                    disabled={isApplyToAll}
                    disabledValue={item.labelAll}
                    options={options}
                    value={limitationsData}
                    onChange={(data): void =>
                      onChangeVal(data, `${item.value}Limitations`)
                    }
                  />
                )}
                <IconButton
                  onClick={(): void => onChangeVal(requestTypeOption)}
                >
                  <IonIcon
                    style={{ fontSize: '20px', color: '#424880' }}
                    name="close"
                  />
                </IconButton>
              </CustomDataLimitations>
            </CustomItem>
          )
        }
      })}
    </CustomRoot>
  )
}

export default TextFieldTagsItem
