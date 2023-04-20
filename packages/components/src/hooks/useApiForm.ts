import {
  IFieldConfig,
  IFieldConfigFormWithFieldset,
  IResource,
  getFieldHeader,
} from '@elastic-suite/gally-admin-shared'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

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
              tooltip:
                resource.gally?.fieldset?.[field?.gally?.form?.fieldset]
                  ?.tooltip,
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

export function useApiDoubleDatePicker(resource: IResource): IResource {
  return useMemo(() => {
    const a = resource.supportedProperty.map((element) => {
      if (
        element?.gally?.input === 'rangeDate' ||
        element?.gally?.form?.input === 'rangeDate'
      ) {
        return {
          ...element,
          title: 'doubleDatePicker',
          property: {
            ...element.property,
            '@id': 'https://localhost/docs.jsonld#Boost/doubleDatePicker',
            label: 'doubleDatePicker',
          },
          gally: {
            ...element?.gally,
            form: {
              ...element?.gally?.form,
              rangeDateId: element?.gally?.form?.rangeDateId,
              rangeDateType: 'doubleDatePicker',
            },
          },
        }
      }
      return element
    })

    const uniqueArray = a.reduce((accumulator, current) => {
      const id = current?.gally?.form?.rangeDateId
      if (
        !accumulator.some(
          (item) =>
            item?.gally?.form?.rangeDateId === id &&
            item?.gally?.form?.rangeDateId
        )
      ) {
        accumulator.push(current)
      }
      return accumulator
    }, [])

    return { ...resource, supportedProperty: uniqueArray }
  }, [resource])
}
