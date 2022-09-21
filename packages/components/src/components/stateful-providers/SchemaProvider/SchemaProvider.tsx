import { ReactNode, useEffect } from 'react'
import { LoadStatus, schemaContext, useSchemaLoader } from 'shared'

import { useLog } from '~/hooks'

interface IProps {
  children: ReactNode
}

function SchemaProvider(props: IProps): JSX.Element {
  const { children } = props
  const log = useLog()
  const api = useSchemaLoader()

  useEffect(() => {
    if (api.status === LoadStatus.FAILED) {
      log(api.error)
    }
  }, [api.error, api.status, log])

  if (!api.data) {
    return null
  }

  return (
    <schemaContext.Provider value={api.data}>{children}</schemaContext.Provider>
  )
}

export default SchemaProvider
