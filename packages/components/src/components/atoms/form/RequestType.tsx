import React from 'react'

import {
  ILimitationsTypes,
  IOptionsTags,
  IRequestType,
  IRequestTypesOptions,
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
}

function RequestType(props: IProps): JSX.Element {
  const { value, onChange, options, limitationsTypes, requestTypesOptions } =
    props

  function updateSelectedDropDown(list: string[] | string): void {
    const newData = (list as string[]).map((item) => {
      const existingRequestType = value.requestTypes.find(
        (it) => it.requestType === item
      )
      return existingRequestType || { requestType: item, applyToAll: false }
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
      />
    </CustomRoot>
  )
}

export default RequestType
