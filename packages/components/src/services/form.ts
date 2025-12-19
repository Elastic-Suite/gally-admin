import {
  IError,
  IErrorsForm,
  IFetch,
  IFieldConfig,
  IHydraResponse,
  ILimitationsTypes,
  IRequestType,
  concatenateValuesWithLineBreaks,
} from '@elastic-suite/gally-admin-shared'
import { InputBaseProps } from '@mui/material'
import { useApiList } from '../hooks'
import { IDoubleDatePickerValues } from '../components/atoms/form/DoubleDatePickerWithoutError'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { TFunction } from 'i18next'

interface IViolations {
  propertyPath?: string
  message?: string
}

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

export function transformPropertyPath(propertyPath: string): string {
  switch (propertyPath) {
    case 'fromDate':
    case 'toDate':
      return 'doubleDatePicker'

    default:
      return propertyPath
  }
}

export function getDoubleDatePickerValue(
  data: Record<string, Date>
): IDoubleDatePickerValues {
  return { fromDate: data?.fromDate, toDate: data?.toDate }
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

export function handleFormErrors(
  formErrors: IError,
  t: TFunction<'resourceForm'>
): IErrorsForm {
  const newErrors: IErrorsForm = { fields: {}, global: [] }

  formErrors?.violations?.forEach((err: IViolations) => {
    if (err?.propertyPath && err?.message) {
      newErrors.fields[transformPropertyPath(err?.propertyPath)] = err.message
    } else if (err?.message) {
      newErrors.global.push(err.message)
    }
  })

  enqueueSnackbar(t('error.form'), {
    onShut: closeSnackbar,
    variant: 'error',
  })

  if (newErrors.global.length !== 0) {
    enqueueSnackbar(concatenateValuesWithLineBreaks(newErrors.global), {
      onShut: closeSnackbar,
      variant: 'error',
      style: { whiteSpace: 'pre-line' },
      autoHideDuration: Infinity,
    })
  }
  return newErrors
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

    case 'date':
    case 'rangeDate':
      return getDoubleDatePickerValue(data as Record<string, Date>)

    default:
      return (data as Record<string, unknown>)?.[(field as IFieldConfig).name]
  }
}
