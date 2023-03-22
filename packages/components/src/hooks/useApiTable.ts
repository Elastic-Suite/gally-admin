import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import {
  IField,
  IFieldConfig,
  IOptions,
  IResource,
  getFieldHeader,
} from '@elastic-suite/gally-admin-shared'

export function useApiHeaders(resource: IResource): IFieldConfig[] {
  const { t } = useTranslation('api')
  return useMemo(() => {
    return (
      resource.supportedProperty
        // .filter((field) => field.gally?.visible && field.gally.input !== 'select')
        .filter((field) => field.gally?.visible)
        .sort((a, b) => a.gally?.position - b.gally?.position)
        .map((field) => {
          // console.log('field LAST = requestTypeLabels', field)
          // console.log('getFieldHeader(field, t)', getFieldHeader(field, t))
          return getFieldHeader(field, t)
        })
    )
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
