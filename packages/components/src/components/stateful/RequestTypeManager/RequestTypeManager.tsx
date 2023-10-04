import React from 'react'
import { useApiList, useFetchApi } from '../../../hooks'
import RequestType from '../../atoms/form/RequestType'
import {
  ICategories,
  ILimitationsTypes,
  IOptionsTags,
  IRequestType,
  IRequestTypesOptions,
  getRequestTypeErrorMessages,
} from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'
import { getRequestTypeData } from '../../../services'

interface IProps {
  data: Record<string, unknown>
  value: IRequestType
  onChange: (value: IRequestType) => void
  label?: string
  required?: boolean
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
  requestTypeConfigurations?: Record<string, string>
  infoTooltip?: string
  placeholder?: string
  error?: boolean
  helperText?: string
  helperIcon?: string
}

function RequestTypeManager(props: IProps): JSX.Element | null {
  const { data, value, onChange, requestTypeConfigurations, ...args } = props

  const { t } = useTranslation('boost')
  const { t: tApi } = useTranslation('api')

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

  const operatorOptions = operatorOptionsApi?.data?.['hydra:member'].map(
    (option) => ({ ...option, label: tApi(option.label) })
  )
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

  // Allows to add categoryLimitations, searchLimitations and XXXLimitations on value.
  const requestTypeValue = getRequestTypeData(data, limitationTypeOptionsApi)

  const requestTypeValid = getRequestTypeErrorMessages(
    value,
    requestTypeOptions,
    t
  )
  return (
    <RequestType
      {...args}
      value={requestTypeValue}
      onChange={onChange}
      options={operatorOptions}
      limitationsTypes={limitationTypeOptions}
      requestTypesOptions={requestTypeOptions}
      categoriesList={categoriesList}
      error={requestTypeValid.length !== 0}
      helperText={requestTypeValid}
    />
  )
}

export default RequestTypeManager
