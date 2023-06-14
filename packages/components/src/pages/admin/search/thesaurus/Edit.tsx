import React, { useContext, useEffect, useState } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { PageTitle, ResourceForm } from '../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['merchandize', 'thesaurus']

function AdminThesaurusEdit(): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation('thesaurus')
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
      <ResourceForm resourceName="Thesaurus" id={idUpdate} />
    </>
  )
}

export default withAuth(withOptions(AdminThesaurusEdit))
