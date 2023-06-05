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

export function useApiHeaders(resource: IResource): IFieldConfig[] {
  const { t } = useTranslation('api')
  const transformedResource = useApiDoubleDatePicker(resource)
  return useMemo(
    () =>
      transformedResource.supportedProperty
        .filter((field) => field.gally?.visible)
        .sort((a, b) => a.gally?.position - b.gally?.position)
        .map((field) => getFieldHeader(field, t)),
    [t, transformedResource]
  )
}

// group all fields that do not have a fieldset in this fieldset
const FIELDSET_OTHER_KEY = '_other'

export function useApiHeadersForm(
  resource: IResource
): IFieldConfigFormWithFieldset[] {
  const apiHeaders = useApiHeaders(resource)
  return useMemo(() => {
    const apiHeaderMap = apiHeaders.reduce<
      Record<string, IFieldConfigFormWithFieldset>
    >(
      (acc, header) => {
        const fieldsetCode = header.fieldset
        const fieldset = resource.gally?.fieldset?.[fieldsetCode]
        if (fieldsetCode && fieldset) {
          if (fieldsetCode in acc) {
            acc[fieldsetCode].children.push(header)
          } else {
            acc[fieldsetCode] = {
              ...fieldset,
              code: fieldsetCode,
              children: [header],
            }
          }
        } else {
          acc[FIELDSET_OTHER_KEY].children.push(header)
        }
        return acc
      },
      {
        [FIELDSET_OTHER_KEY]: {
          code: FIELDSET_OTHER_KEY,
          children: [],
          position: Infinity,
        },
      }
    )
    return Object.values(apiHeaderMap).sort((a, b) => a?.position - b?.position)
  }, [apiHeaders, resource])
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
