import React, { useContext, useEffect, useState } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { ResourceForm } from '../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import { useTranslation } from 'next-i18next'
import { Role } from '@elastic-suite/gally-admin-shared'

const pagesSlug = ['settings', 'users']

function AdminUserEdit(): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation('user')
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
      resourceName="User"
      entityLabel={t('entityLabel')}
      id={idUpdate}
    />
  )
}

export default withAuth(Role.ADMIN)(withOptions(AdminUserEdit))
