import { IDependsForm } from '@elastic-suite/gally-admin-shared'
import { InputBaseProps } from '@mui/material'

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

export function getDoubleDatePickerValue(data: Record<string, unknown>) {
  return { from: data?.fromDate, to: data?.toDate }
}

export function isHiddenDepends(
  dependsForm: IDependsForm[],
  data: Record<string, unknown> | undefined
) {
  return dependsForm
    .map((item) => {
      const field = item?.field as string
      const value = item?.value
      const fieldValue = data?.[field]
      return Boolean(fieldValue && (value ? fieldValue === value : true))
    })
    .some((its) => !its)
}
