import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { ResourceForm } from '../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['search', 'thesaurus']

function AdminUserCreate(): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation('thesaurus')
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return <ResourceForm title={t('title.create')} resourceName="User" />
}

export default withAuth(withOptions(AdminUserCreate))
