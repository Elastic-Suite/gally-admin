import React, { useContext, useEffect, useState } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { setupStore } from '../../../../store'
import {
  AppProvider,
  DataProvider,
  PageTitle,
  ResourceForm,
} from '../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['merchandize', 'boosts']

function AdminBoostEdit(): JSX.Element {
  const store = setupStore()
  const router = useRouter()
  const { t } = useTranslation('boost')
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const [idUpdate, setIdUpdate] = useState<string>('')

  useEffect(() => {
    setBreadcrumb(pagesSlug)
    setIdUpdate(router?.query?.id as string)
  }, [router.query, setBreadcrumb])

  if (!idUpdate) {
    return null
  }

  return (
    <>
      <PageTitle title={t('title.update')} sx={{ marginBottom: '32px' }} />
      <AppProvider store={store}>
        <DataProvider>
          <ResourceForm
            resourceName="Boost"
            id={idUpdate}
            categoriesList={[]}
          />
        </DataProvider>
      </AppProvider>
    </>
  )
}

export default withAuth(withOptions(AdminBoostEdit))
