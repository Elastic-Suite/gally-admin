import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import {
  IField,
  IFieldConfig,
  IOptions,
  IResource,
  getFieldHeader,
  IFieldConfigFormWithFieldset,
} from '@elastic-suite/gally-admin-shared'

export function useApiHeaders(resource: IResource): IFieldConfig[] {
  const { t } = useTranslation('api')
  return useMemo(() => {
    return resource.supportedProperty
      .filter((field) => field.gally?.visible)
      .sort((a, b) => a.gally?.position - b.gally?.position)
      .map((field) => getFieldHeader(field, t))
  }, [resource, t])
}
//IFieldConfigFormWithFieldset[]
export function useApiHeadersForm(
  resource: IResource
): IFieldConfig[] | IFieldConfigFormWithFieldset[] {
  const { t } = useTranslation('api')
  return useMemo(() => {
    if (resource.gally?.fieldset) {
      const newArr: IFieldConfigFormWithFieldset[] = []
      resource.supportedProperty
        .filter((field) => field.gally?.form?.visible ?? field.gally?.visible)
        .sort(
          (a, b) =>
            (a.gally?.form.position ?? a.gally?.position) -
            (b.gally?.form.position ?? b.gally?.position)
        )
        .forEach((field) => {
          const fieldsetIndex = newArr.findIndex(
            (item) => item.code === field?.gally?.form?.fieldset
          )
          if (fieldsetIndex !== -1) {
            newArr[fieldsetIndex].children.push(getFieldHeader(field, t))
          } else {
            newArr.push({
              position:
                resource.gally?.fieldset?.[field?.gally?.form?.fieldset]
                  ?.position,
              label:
                resource.gally?.fieldset?.[field?.gally?.form?.fieldset]?.label,
              code: field?.gally?.form?.fieldset,
              children: [getFieldHeader(field, t)],
            })
          }
        })
      return newArr.sort(
        (a, b) => a.position - b.position
      ) as IFieldConfigFormWithFieldset[]
    }

    return resource.supportedProperty
      .filter((field) => field.gally?.form?.visible ?? field.gally?.visible)
      .sort((a, b) => {
        return (
          (a.gally?.form?.position ?? a.gally?.position) -
          (b.gally?.form?.position ?? b.gally?.position)
        )
      })
      .map((field) => getFieldHeader(field, t)) as IFieldConfig[]
  }, [resource, t])
}

export function useApiEditableFieldOptions(
  resource: IResource
): IOptions<IField> {
  return useMemo(() => {
    return resource.supportedProperty
      .filter(
        (field) =>
          field.gally?.visible && field.gally?.editable && field.writeable
      )
      .map((field) => ({
        id: field.title,
        label: field.property.label,
        value: field,
      }))
  }, [resource])
}

export function useApiDoubleDatePicker(
  data: IFieldConfig[] | IFieldConfigFormWithFieldset[]
): IFieldConfig[] | IFieldConfigFormWithFieldset[] {
  console.log('resource', data)
  return useMemo(() => {
    const newData = data.map((item) => {
      console.log('item', item)
      return (
        (item as IFieldConfigFormWithFieldset)?.children?.filter((it) => {
          return it.input !== 'rangeDate'
        }) ?? (item as IFieldConfig)
      )
    }) as IFieldConfig[] | IFieldConfigFormWithFieldset[]

    return newData
  }, [data])
}
