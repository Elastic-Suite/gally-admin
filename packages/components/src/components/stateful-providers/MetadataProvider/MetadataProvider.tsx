import {
  IHydraResponse,
  IMetadata,
  isError,
  isValidUser,
} from '@elastic-suite/gally-admin-shared'
import React, { ReactNode, useEffect, useState } from 'react'

import { metadataContext } from '../../../contexts'
import { useApiFetch, useLog, useResource, useUser } from '../../../hooks'

interface IProps {
  children: ReactNode
}

function MetadataProvider(props: IProps): JSX.Element {
  const { children } = props

  const log = useLog()
  const fetchApi = useApiFetch()
  const resource = useResource('Metadata')
  const user = useUser()

  const [metadata, setMetadata] = useState<IMetadata[]>([])

  useEffect(() => {
    if (isValidUser(user)) {
      fetchApi<IHydraResponse<IMetadata>>(resource).then((json) => {
        if (isError(json)) {
          log(json.error)
        } else {
          setMetadata(json.member)
        }
      })
    }
  }, [fetchApi, log, resource, user])

  return (
    <metadataContext.Provider value={metadata}>
      {children}
    </metadataContext.Provider>
  )
}

export default MetadataProvider
