import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import {
  IFieldConfig,
  IHydraMember,
  IHydraResponse,
  IResource,
  getFilter,
  getMappings,
} from '@elastic-suite/gally-admin-shared'

export function useApiFilters<A extends IHydraMember>(
  apiData: IHydraResponse<A>,
  resource: IResource
): IFieldConfig[] {
  const { t } = useTranslation('api')
  const mappings = useMemo(
    () => getMappings(apiData, resource),
    [apiData, resource]
  )
  console.log('mappings', mappings)
  return useMemo(
    () => mappings.map((mapping) => getFilter(mapping, t)),
    [mappings, t]
  )
}
