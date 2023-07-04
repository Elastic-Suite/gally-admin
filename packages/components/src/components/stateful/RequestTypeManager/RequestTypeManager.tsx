import React from 'react'
import { useApiList, useFetchApi } from '../../../hooks'
import RequestType from '../../atoms/form/RequestType'
import {
  ICategories,
  ILimitationsTypes,
  IOptionsTags,
  IRequestType,
  IRequestTypesOptions,
} from '@elastic-suite/gally-admin-shared'

interface IProps {
  value: IRequestType
  onChange: (value: IRequestType) => void
  label?: string
  required?: boolean
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  requestTypeConfigurations?: Record<string, string>
  infoTooltip?: string
  placeholder?: string
}

function RequestTypeManager(props: IProps): JSX.Element | null {
  const { value, onChange, requestTypeConfigurations, ...args } = props

  const [operatorOptionsApi] = useApiList<IOptionsTags>(
    requestTypeConfigurations?.operatorOptionsApi
  )
  const [limitationTypeOptionsApi] = useApiList<ILimitationsTypes>(
    requestTypeConfigurations?.limitationTypeOptionsApi
  )
  const [requestTypeOptionsApi] = useApiList<IRequestTypesOptions>(
    requestTypeConfigurations?.requestTypeOptionsApi
  )
  const [categoriesListApi] = useFetchApi<ICategories>(
    requestTypeConfigurations?.categoryTreeApi ?? 'categoryTree'
  )

  const operatorOptions = operatorOptionsApi?.data?.['hydra:member']
  const limitationTypeOptions = limitationTypeOptionsApi?.data?.['hydra:member']
  const requestTypeOptions = requestTypeOptionsApi?.data?.['hydra:member']
  const categoriesList = categoriesListApi?.data?.categories

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
