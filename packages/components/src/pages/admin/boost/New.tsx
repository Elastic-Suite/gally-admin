import React, { useContext, useEffect } from 'react'
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

function AdminBoostCreate(): JSX.Element {
  const store = setupStore()
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('boost')

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <>
      <PageTitle title={t(pagesSlug.at(-1))} sx={{ marginBottom: '32px' }} />
      <AppProvider store={store}>
        <DataProvider>
          <ResourceForm resourceName="Boost" />
        </DataProvider>
      </AppProvider>
    </>
  )
}

export default withAuth(withOptions(AdminBoostCreate))
