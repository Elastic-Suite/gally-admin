import React, { useContext, useEffect, useState } from 'react'
import { withAuth, withOptions } from '../../../hocs'
import { setupStore } from '../../../../src/store'
import {
  AppProvider,
  DataProvider,
  PageTitle,
  ResourceForm,
} from '../../../../src/components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../src/contexts'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['search', 'configuration', 'attributes']

function AdminBoostUpdate(): JSX.Element {
  const store = setupStore()
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const [idUpdate, setIdUpdate] = useState<string>('')
  const { t } = useTranslation('boost')

  useEffect(() => {
    setBreadcrumb(pagesSlug)
    setIdUpdate(router?.query?.id as string)
  }, [router.query, setBreadcrumb])

  if (!idUpdate) {
    return null
  }

  return (
    <>
      <PageTitle title={t(pagesSlug.at(-1))} sx={{ marginBottom: '32px' }} />
      <AppProvider store={store}>
        <DataProvider>
          <ResourceForm resourceName="Boost" id={idUpdate} />
        </DataProvider>
      </AppProvider>
    </>
  )
}

export default withAuth(withOptions(AdminBoostUpdate))
