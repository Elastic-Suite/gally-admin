import React, { useContext, useEffect, useState } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { ResourceForm } from '../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['merchandize', 'boosts']

function AdminBoostEdit(): JSX.Element {
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
    <ResourceForm
      title={t('title.update')}
      resourceName="Boost"
      id={idUpdate}
      categoriesList={[]}
    />
  )
}

export default withAuth(withOptions(AdminBoostEdit))
