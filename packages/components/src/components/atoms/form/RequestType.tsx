import React from 'react'

import {
  ILimitationsTypes,
  IOptionsTags,
  IRequestType,
  IRequestTypesOptions,
  ITreeItem,
} from '@elastic-suite/gally-admin-shared'

import { CustomRoot } from './RequestTypeItem.styled'
import DropDown from './DropDown'
import RequestTypeItem from './RequestTypeItem'

export interface IProps {
  value: IRequestType
  onChange: (value: IRequestType) => void
  options: IOptionsTags[]
  limitationsTypes: ILimitationsTypes[]
  requestTypesOptions: IRequestTypesOptions[]
  categoriesList: ITreeItem[]
}

function RequestType(props: IProps): JSX.Element {
  const {
    value,
    onChange,
    options,
    limitationsTypes,
    requestTypesOptions,
    categoriesList,
  } = props

  function updateSelectedDropDown(list: string[] | string): void {
    const newData = (list as string[]).map((item) => {
      const existingRequestType = value.requestTypes.some((it) => {
        return it.requestType === item
      })
      if (existingRequestType) {
        return value.requestTypes.find((it) => it.requestType === item)!
      }
      const limitation_type = requestTypesOptions.find(
        (it) => it.value === item
      )?.limitation_type

      const requestTypesValue = requestTypesOptions
        .filter((it) => it.limitation_type === limitation_type)
        .map((it) => it.value)

      const applyToAll = value.requestTypes.find((item) =>
        requestTypesValue.includes(item.requestType)
      )?.applyToAll

      return { requestType: item, applyToAll: Boolean(applyToAll) }
    })
    return onChange({ ...value, requestTypes: newData })
  }

  return (
    <CustomRoot>
      <DropDown
        placeholder={value.requestTypes.length !== 0 ? '' : 'Add request type'}
        multiple
        onChange={updateSelectedDropDown}
        value={value.requestTypes.map((item) => item.requestType)}
        options={requestTypesOptions}
      />
      <RequestTypeItem
        value={value}
        onChange={onChange}
        limitationsTypes={limitationsTypes}
        options={options}
        requestTypesOptions={requestTypesOptions}
        categoriesList={categoriesList}
      />
    </CustomRoot>
  )
}

export default RequestType
