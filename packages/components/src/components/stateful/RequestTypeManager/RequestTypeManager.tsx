import React from 'react'
import { useApiList } from '../../../hooks'
import RequestType from '../../atoms/form/RequestType'
import {
  ILimitationsTypes,
  IOptionsTags,
  IRequestType,
  IRequestTypesOptions,
  ITreeItem,
} from '@elastic-suite/gally-admin-shared'

interface IProps {
  value: IRequestType
  onChange: (value: IRequestType) => void
  label?: string
  required?: boolean
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  requestTypeConfigurations?: Record<string, string>
  categoriesList: ITreeItem[]
  infoTooltip?: string
}

function RequestTypeManager(props: IProps): JSX.Element | null {
  const {
    value,
    onChange,
    requestTypeConfigurations,
    categoriesList,
    ...args
  } = props

  const [operatorOptionsApi] = useApiList<IOptionsTags>(
    requestTypeConfigurations?.operatorOptionsApi
  )
  const [limitationTypeOptionsApi] = useApiList<ILimitationsTypes>(
    requestTypeConfigurations?.limitationTypeOptionsApi
  )
  const [requestTypeOptionsApi] = useApiList<IRequestTypesOptions>(
    requestTypeConfigurations?.requestTypeOptionsApi
  )

  const operatorOptions = operatorOptionsApi?.data?.['hydra:member']
  const limitationTypeOptions = limitationTypeOptionsApi?.data?.['hydra:member']
  const requestTypeOptions = requestTypeOptionsApi?.data?.['hydra:member']

  if (
    !(
      operatorOptions &&
      limitationTypeOptions &&
      requestTypeOptions &&
      categoriesList &&
      value?.requestTypes
    )
  ) {
    return null
  }

  return (
    <RequestType
      {...args}
      value={value}
      onChange={onChange}
      options={operatorOptions}
      limitationsTypes={limitationTypeOptions}
      requestTypesOptions={requestTypeOptions}
      categoriesList={categoriesList}
    />
  )
}

export default RequestTypeManager
