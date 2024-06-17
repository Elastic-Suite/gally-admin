import {
  IDependsForm,
  IFetch,
  IFieldConfig,
  IHydraResponse,
  ILimitationsTypes,
  IRequestType,
} from '@elastic-suite/gally-admin-shared'
import { InputBaseProps } from '@mui/material'
import { useApiList } from '../hooks'
import { IDoubleDatePickerValues } from '../components/atoms/form/DoubleDatePicker'

export type IProps = Pick<InputBaseProps, 'required' | 'type'>

export function getFormValue(value: string, props: IProps): string | number {
  const { required, type } = props
  if (type === 'number') {
    if (value === '' && !required) {
      return null
    }
    return Number(value)
  }
  return value
}

export function getDoubleDatePickerValue(
  data: Record<string, Date>
): IDoubleDatePickerValues {
  return { fromDate: data?.fromDate, toDate: data?.toDate }
}

export function isHiddenDepends(
  dependsForm: IDependsForm[],
  data: Record<string, unknown> | undefined
): boolean {
  return dependsForm.some((item) => {
    const field = item?.field as string
    const { value } = item
    const fieldValue = data?.[field]
    return (
      fieldValue === undefined || (value !== fieldValue && value !== undefined)
    )
  })
}

export function getRequestTypeData(
  data?: Record<string, any>,
  limitationTypeOptionsApi?: IFetch<IHydraResponse<ILimitationsTypes>>
): IRequestType {
  if (!data) {
    return null
  }

  const requestTypeData = {} as IRequestType

  limitationTypeOptionsApi?.data?.['hydra:member'].forEach((it) => {
    requestTypeData[`${it.value}Limitations` as keyof IRequestType] =
      data[`${it.value}Limitations`] ?? []
  })

  return { ...requestTypeData, requestTypes: data.requestTypes }
}

export function useValue(
  field: IFieldConfig | string,
  data: unknown
): unknown | IRequestType {
  const [limitationTypeOptionsApi] = useApiList<ILimitationsTypes>(
    field && (field as IFieldConfig)?.input === 'requestType'
      ? (field as IFieldConfig)?.requestTypeConfigurations
          ?.limitationTypeOptionsApi ?? 'boost_limitation_type_options'
      : field && typeof field === 'string'
      ? field
      : undefined
  )

  if (!field) {
    return null
  }

  if (typeof field === 'string') {
    return getRequestTypeData(data, limitationTypeOptionsApi)
  }
  switch ((field as IFieldConfig)?.input) {
    case 'requestType':
      return getRequestTypeData(data, limitationTypeOptionsApi)

    case 'rangeDate':
      return getDoubleDatePickerValue(data as Record<string, Date>)

    default:
      return (data as Record<string, unknown>)?.[(field as IFieldConfig).name]
  }
}
