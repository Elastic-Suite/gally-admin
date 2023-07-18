import {
  IDependsForm,
  IFieldConfig,
  ILimitationsTypes,
  IRequestType,
} from '@elastic-suite/gally-admin-shared'
import { InputBaseProps } from '@mui/material'
import { Dayjs } from 'dayjs'
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
  data: Record<string, Dayjs>
): IDoubleDatePickerValues {
  return { from: data?.fromDate, to: data?.toDate }
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
  data: Record<string, any>,
  field: IFieldConfig
): IRequestType {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [limitationTypeOptionsApi] = useApiList<ILimitationsTypes>(
    field?.requestTypeConfigurations?.limitationTypeOptionsApi ??
      'boost_limitation_type_options'
  )

  const requestTypeData = {} as IRequestType

  limitationTypeOptionsApi?.data?.['hydra:member'].forEach((it) => {
    requestTypeData[`${it.value}Limitations` as keyof IRequestType] =
      data[`${it.value}Limitations`] ?? []
  })

  return { ...requestTypeData, requestTypes: data.requestTypes }
}

export function getValue(field: IFieldConfig, data: unknown): unknown {
  switch (field?.input) {
    case 'requestType':
      return getRequestTypeData(data, field)

    case 'rangeDate':
      return getDoubleDatePickerValue(data as Record<string, Dayjs>)

    default:
      return (data as Record<string, unknown>)?.[field.name]
  }
}
