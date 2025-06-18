import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { ResourceForm } from '../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import { useTranslation } from 'next-i18next'
import { Role } from '@elastic-suite/gally-admin-shared'

const pagesSlug = ['settings', 'users']

function AdminUserCreate(): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation('user')
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <ResourceForm
      title={t('title.create')}
      resourceName="User"
      entityLabel={t('user')}
    />
  )
}

export default withAuth(Role.ADMIN)(withOptions(AdminUserCreate))
