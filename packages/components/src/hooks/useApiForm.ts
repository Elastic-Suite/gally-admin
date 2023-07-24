import { IResource } from '@elastic-suite/gally-admin-shared'
import { useMemo } from 'react'

export function useApiDoubleDatePicker(resource: IResource): IResource {
  return useMemo(() => {
    const newSupportedProperty = resource.supportedProperty.map((element) => {
      if (element?.gally?.input === 'rangeDate') {
        return {
          ...element,
          title: 'doubleDatePicker',
        }
      }
      return element
    })

    const uniqueArray = newSupportedProperty.reduce((accumulator, current) => {
      const id = current?.gally?.rangeDateId
      if (
        !accumulator.some(
          (item) => item?.gally?.rangeDateId === id && item?.gally?.rangeDateId
        )
      ) {
        accumulator.push(current)
      }
      return accumulator
    }, [])

    return { ...resource, supportedProperty: uniqueArray }
  }, [resource])
}
