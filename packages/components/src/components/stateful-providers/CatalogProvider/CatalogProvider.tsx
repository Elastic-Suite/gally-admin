import {
  IHydraCatalog,
  IHydraResponse,
  isError,
  isValidUser,
} from '@elastic-suite/gally-admin-shared'
import React, { ReactNode, useEffect, useState } from 'react'

import { catalogContext } from '../../../contexts'
import {
  useApiFetch,
  useCatalogs,
  useLog,
  useResource,
  useUser,
} from '../../../hooks'

interface IProps {
  children: ReactNode
}

function CatalogProvider(props: IProps): JSX.Element {
  const { children } = props

  const log = useLog()
  const fetchApi = useApiFetch()
  const resource = useResource('Catalog')
  const user = useUser()

  const [catalogs, setCatalogs] = useState<IHydraCatalog[]>([])

  useEffect(() => {
    if (isValidUser(user)) {
      fetchApi<IHydraResponse<IHydraCatalog>>(resource).then((json) => {
        if (isError(json)) {
          log(json.error)
        } else {
          setCatalogs(json['hydra:member'])
        }
      })
    }
  }, [fetchApi, log, resource, user])

  const contextValue = useCatalogs(catalogs)

  return (
    <catalogContext.Provider value={contextValue}>
      {children}
    </catalogContext.Provider>
  )
}

export default CatalogProvider
