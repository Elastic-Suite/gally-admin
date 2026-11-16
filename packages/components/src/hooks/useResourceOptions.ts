import { useContext, useEffect } from 'react'
import { IOptions, ISearchParameters } from '@elastic-suite/gally-admin-shared'

import { optionsContext } from '../contexts'

import { useResource } from './useResource'

export function useResourceOptions(
  resourceName: string,
  searchParameters: ISearchParameters = {}
): IOptions<string> | undefined {
  const { fieldOptions, loadOptions } = useContext(optionsContext)
  const resource = useResource(resourceName)
  const query = JSON.stringify(searchParameters)
  const id = `${resourceName}:${query}`

  useEffect(() => {
    loadOptions(id, resource, JSON.parse(query))
  }, [id, loadOptions, query, resource])

  return fieldOptions.get(id) as IOptions<string> | undefined
}
