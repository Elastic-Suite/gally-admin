import {
  IHydraCatalog,
  IHydraResponse,
  isError,
  isValidUser,
} from '@elastic-suite/gally-admin-shared'
import React, { ReactNode, useEffect, useState } from 'react'

import { catalogContext } from '../../../contexts'
import { useApiFetch, useCatalogs, useLog, useResource } from '../../../hooks'
import { selectUser, useAppSelector } from '../../../store'

interface IProps {
  children: ReactNode
}

function CatalogProvider(props: IProps): JSX.Element {
  const { children } = props

  const log = useLog()
  const fetchApi = useApiFetch()
  const resource = useResource('Catalog')
  const user = useAppSelector(selectUser)

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

  if (catalogs.length === 0) {
    return null
  }

  return (
    <catalogContext.Provider value={contextValue}>
      {children}
    </catalogContext.Provider>
  )
}

export default CatalogProvider
