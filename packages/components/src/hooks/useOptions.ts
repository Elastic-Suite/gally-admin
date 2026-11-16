import { useTranslation } from 'next-i18next'
import { useCallback, useMemo } from 'react'
import {
  IApiSchemaOptions,
  IFetchApi,
  IField,
  IHydraMember,
  IHydraResponse,
  IOptions,
  IOptionsContext,
  IResource,
  ISearchParameters,
  getOptionsFromApiSchema,
  getOptionsFromResource,
  getReferencedResource,
  hasFieldOptions,
  isDropdownStaticOptions,
  isError,
  isReferenceField,
} from '@elastic-suite/gally-admin-shared'

import { selectApi, useAppSelector } from '../store'

import { useSingletonLoader } from './useSingletonLoader'

export function useOptions(): IOptionsContext {
  const { fetch, map, statuses } =
    useSingletonLoader<IOptions<string | number>>()
  const api = useAppSelector(selectApi)
  const { t } = useTranslation('options')

  const loadOptions = useCallback(
    (
      id: string,
      resource: IResource | string,
      searchParameters?: ISearchParameters
    ) =>
      fetch(id, async (fetchApi: IFetchApi) => {
        const response = await fetchApi(resource, searchParameters)
        if (!isError(response)) {
          return getOptionsFromApiSchema(
            response as IHydraResponse<IApiSchemaOptions>
          )
        }
        throw new Error('error')
      }),
    [fetch]
  )

  const load = useCallback(
    (field: IField) => {
      const id = field.property['@id']
      if (
        hasFieldOptions(field) &&
        !isDropdownStaticOptions(field.gally?.options)
      ) {
        // options from api
        return loadOptions(id, field.gally.options.api_rest)
      }
      return fetch(id, async (fetchApi: IFetchApi) => {
        if (
          hasFieldOptions(field) &&
          isDropdownStaticOptions(field.gally.options)
        ) {
          // static options from the schema
          return field.gally.options.values.map((option) => ({
            ...option,
            label: option?.label,
          }))
        } else if (isReferenceField(field)) {
          // get options by loading all items of the referenced field
          const response = await fetchApi(
            getReferencedResource(api, field)?.url
          )
          if (!isError(response)) {
            return getOptionsFromResource(
              response as IHydraResponse<IHydraMember>
            )
          }
          throw new Error('error')
        }
      })
    },
    [api, fetch, loadOptions]
  )

  return useMemo(() => {
    const mapTranslated = new Map(map)
    mapTranslated.forEach((options) =>
      options.forEach((option) => {
        option.label = t(option.label)
      })
    )

    return { fieldOptions: mapTranslated, load, loadOptions, statuses }
  }, [load, loadOptions, map, statuses, t])
}
