import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { ResourceForm } from '../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['merchandize', 'boosts']

function AdminBoostCreate(): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation('boost')
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return <ResourceForm title={t('title.create')} resourceName="Boost" />
}

export default withAuth(withOptions(AdminBoostCreate))
