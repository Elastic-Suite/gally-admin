import {
  IDependsForm,
  IFieldConfig,
  IRequestType,
} from '@elastic-suite/gally-admin-shared'
import { InputBaseProps } from '@mui/material'
import { Dayjs } from 'dayjs'
import { IDoubleDatePickerValues } from 'src/components/atoms/form/DoubleDatePicker'

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

export function getRequestTypeData(data: Record<string, any>): IRequestType {
  const a = [
    {
      id: 'category',
      value: 'category',
      label: 'Category',
      labelAll: 'All categories',
    },
    {
      id: 'search',
      value: 'search',
      label: 'Search',
      labelAll: 'All search terms',
    },
  ]

  const requestTypeData = {} as IRequestType
  // for (const key in data) {
  //   if (key.endsWith('Limitations') || key === 'requestTypes') {
  //     requestTypeData[key as keyof IRequestType] = data[key]
  //   }
  // }

  a.forEach((it) => {
    requestTypeData[`${it.value}Limitations` as keyof IRequestType] =
      data[`${it.value}Limitations`]
  })

  return { ...requestTypeData, requestTypes: data['requestTypes'] }
}

export function getValue(field: IFieldConfig, data: unknown): unknown {
  switch (field?.input) {
    case 'requestType':
      return getRequestTypeData(data)

    case 'rangeDate':
      return getDoubleDatePickerValue(data as Record<string, Dayjs>)

    default:
      return (data as Record<string, unknown>)?.[field.name]
  }
}
