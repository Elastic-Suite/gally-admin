import React from 'react'
import { styled } from '@mui/system'

import {
  ILimitations,
  ILimitationsTypes,
  IOptionsTags,
  IRequestType,
  IRequestTypesOptions,
} from '@elastic-suite/gally-admin-shared'

import TextFieldTagsMultiple from './TextFieldTagsMultiple'

import Checkbox from './Checkbox'
import { IconButton } from '@mui/material'
import IonIcon from '../IonIcon/IonIcon'
import {
  CustomFirstSelectedItem,
  CustomRootItem,
  CustomSelectedItem,
} from './RequestTypeItem.styled'

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
  width: '190px',
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

function RequestTypeItem(props: ITextFieldTagssss): JSX.Element {
  const { value, onChange, options, limitationsTypes, requestTypesOptions } =
    props

  function onChangeVal(
    idItem: IRequestTypesOptions[] | ILimitations[],
    val?: boolean | string
  ): void {
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

  function countLines(): number {
    const listUniqueLimitationType: string[] = []
    for (const item of value.requestTypes) {
      const limitation_type = requestTypesOptions.find(
        (its) => its.value === item.requestType
      )?.limitation_type

      if (
        limitation_type &&
        !listUniqueLimitationType.includes(limitation_type)
      ) {
        listUniqueLimitationType.push(limitation_type)
      }
    }
    return listUniqueLimitationType.length
  }

  return (
    <CustomRootItem>
      {limitationsTypes.map((item, key) => {
        const requestTypeOption = requestTypesOptions.filter(
          (it) =>
            it.limitation_type === item.value &&
            value.requestTypes.find((its) => its.requestType === it.value)
        )

        if (requestTypeOption.length === 0) {
          return null
        }

        const concatLabel = requestTypeOption.map((it) => it.label)
        const isApplyToAll = value.requestTypes.find(
          (it) =>
            it.requestType ===
            requestTypeOption.find((its) => its.value === it.requestType)?.value
        )?.applyToAll

        const limitationsData = value[`${item.value}Limitations`]
        let multiVal = key + 1 < countLines()
        let CustomDiv = CustomSelectedItem

        if (key === 0 || countLines() === 1) {
          multiVal = countLines() === 1
          CustomDiv = CustomFirstSelectedItem
        }

        return (
          <CustomDiv key={item.value} multiVal={multiVal}>
            <CustomItem>
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
          </CustomDiv>
        )
      })}
    </CustomRootItem>
  )
}

export default RequestTypeItem
