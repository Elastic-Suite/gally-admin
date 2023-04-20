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
      const newArr: IFieldConfigFormWithFieldset[] = []
      transformedResource.supportedProperty
        .filter((field) => field.gally?.visible)
        .sort((a, b) => a.gally?.position - b.gally?.position)
        .forEach((field) => {
          const fieldsetIndex = newArr.findIndex(
            (item) => item.code === field?.gally?.fieldset
          )
          if (fieldsetIndex !== -1) {
            newArr[fieldsetIndex].children.push(getFieldHeader(field, t))
          } else {
            newArr.push({
              position:
                transformedResource.gally?.fieldset?.[field?.gally?.fieldset]
                  ?.position,
              label:
                transformedResource.gally?.fieldset?.[field?.gally?.fieldset]
                  ?.label,
              code: field?.gally?.fieldset,
              tooltip:
                transformedResource.gally?.fieldset?.[field?.gally?.fieldset]
                  ?.tooltip,
              children: [getFieldHeader(field, t)],
            })
          }
        })
      return newArr.sort(
        (a, b) => a.position - b.position
      ) as IFieldConfigFormWithFieldset[]
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
