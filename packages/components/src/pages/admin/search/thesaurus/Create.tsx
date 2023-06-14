import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { PageTitle, ResourceForm } from '../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['search', 'thesaurus']

function AdminThesaurusCreate(): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation('thesaurus')
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <>
      <PageTitle title={t('title.create')} sx={{ marginBottom: '32px' }} />
      <ResourceForm resourceName="Thesaurus" />
    </>
  )
}

export default withAuth(withOptions(AdminThesaurusCreate))
