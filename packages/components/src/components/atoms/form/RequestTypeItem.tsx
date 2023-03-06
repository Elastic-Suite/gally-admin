import React from 'react'
import { styled } from '@mui/system'

import {
  ICategoryLimitations,
  ILimitationsTypes,
  IOptionsTags,
  IRequestType,
  IRequestTypesOptions,
  ISearchLimitations,
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

  function onChangeApplyToAll(
    idItem: IRequestTypesOptions[],
    val: boolean
  ): void {
    const newData = value.requestTypes.map((item) => {
      if (
        item.requestType ===
        (idItem as IRequestTypesOptions[]).find(
          (it) => it.value === item.requestType
        )?.value
      ) {
        return { ...item, applyToAll: val }
      }
      return item
    })
    return onChange({ ...value, requestTypes: newData })
  }

  function onChangeDataLimitations(
    idItem: string,
    val: ISearchLimitations[]
  ): void {
    return onChange({ ...value, [idItem]: val })
  }

  function onDeleteLine(idItem: IRequestTypesOptions[]): void {
    const newData = value.requestTypes.filter(
      (item) =>
        item.requestType !==
        (idItem as IRequestTypesOptions[]).find(
          (it) => it.value === item.requestType
        )?.value
    )
    return onChange({ ...value, requestTypes: newData })
  }

  return (
    <CustomRootItem>
      {limitationsTypes.map((item, key) => {
        const limitationTypeMap = requestTypesOptions.reduce<
          Record<string, string>
        >((acc, option) => {
          acc[option.value] = option.limitation_type
          return acc
        }, {})
        const uniqLimitationTypes = new Set(
          value.requestTypes.map((item) => limitationTypeMap[item.requestType])
        )
        const countLines = uniqLimitationTypes.size

        const requestTypeOption = requestTypesOptions.filter(
          (it) =>
            it.limitation_type === item.value &&
            value.requestTypes.find((its) => its.requestType === it.value)
        )

        if (requestTypeOption.length === 0) {
          return null
        }

        const concatLabel = requestTypeOption.map((it) => it.label)

        const findValueInRequestTypesOptions = requestTypesOptions.find(
          (it) => it.limitation_type === item.value
        )?.value
        const isApplyToAll = value.requestTypes.find(
          (it) => it.requestType === findValueInRequestTypesOptions
        )?.applyToAll

        const limitationsData: ISearchLimitations[] | ICategoryLimitations[] =
          value[`${item.value}Limitations`]
        let uniqueLine = key + 1 < countLines
        let CustomDiv = CustomSelectedItem

        if (key === 0 || countLines === 1) {
          uniqueLine = countLines === 1
          CustomDiv = CustomFirstSelectedItem
        }

        return (
          <CustomDiv key={item.value} uniqueLine={uniqueLine}>
            <CustomItem>
              <CustomLabel>{concatLabel.join(' / ')}</CustomLabel>
              <div style={{ marginTop: '-12px' }}>
                <Checkbox
                  checked={isApplyToAll}
                  label={item.labelAll}
                  onChange={(val: boolean): void =>
                    onChangeApplyToAll(requestTypeOption, val)
                  }
                />
              </div>
              <CustomDataLimitations>
                {item.value === 'search' && (
                  <TextFieldTagsMultiple
                    disabled={isApplyToAll}
                    disabledValue={item.labelAll}
                    options={options}
                    value={limitationsData as ISearchLimitations[]}
                    onChange={(data): void =>
                      onChangeDataLimitations(`${item.value}Limitations`, data)
                    }
                  />
                )}
                <IconButton
                  onClick={(): void => onDeleteLine(requestTypeOption)}
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
