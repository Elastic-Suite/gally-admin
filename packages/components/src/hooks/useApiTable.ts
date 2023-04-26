import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import {
  IField,
  IFieldConfig,
  IFieldConfigFormWithFieldset,
  IOptions,
  IResource,
  getFieldHeader,
} from '@elastic-suite/gally-admin-shared'
import { useApiDoubleDatePicker } from './useApiForm'

export function useApiHeaders(
  resource: IResource
): IFieldConfig[] | IFieldConfigFormWithFieldset[] {
  const { t } = useTranslation('api')
  let transformedResource = useApiDoubleDatePicker(resource)
  return useMemo(() => {
    if (transformedResource.gally?.fieldset) {
      const fieldsetMap: { [key: string]: IFieldConfigFormWithFieldset } = {}

      transformedResource.supportedProperty
        .filter((field) => field.gally?.visible)
        .sort((a, b) => a.gally?.position - b.gally?.position)
        .forEach((field) => {
          const fieldsetCode = field?.gally?.fieldset
          const fieldHeader = getFieldHeader(field, t)

          if (fieldsetCode in fieldsetMap) {
            fieldsetMap[fieldsetCode].children.push(fieldHeader)
          } else {
            const fieldset = transformedResource.gally?.fieldset?.[fieldsetCode]
            fieldsetMap[fieldsetCode] = {
              position: fieldset?.position,
              label: fieldset?.label,
              code: fieldsetCode,
              tooltip: fieldset?.tooltip,
              children: [fieldHeader],
            }
          }
        })

      const result = Object.values(fieldsetMap).sort(
        (a, b) => a.position - b.position
      ) as IFieldConfigFormWithFieldset[]

      return result
    }
    return transformedResource.supportedProperty
      .filter((field) => field.gally?.visible)
      .sort((a, b) => a.gally?.position - b.gally?.position)
      .map((field) => getFieldHeader(field, t))
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
