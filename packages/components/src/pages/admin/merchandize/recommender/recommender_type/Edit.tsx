import React, { useContext, useEffect, useState } from 'react'
import { withAuth, withOptions } from '../../../../../hocs'
import { ResourceForm } from '../../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../../contexts'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['merchandize', 'recommender', 'recommender_type']

function AdminRecommenderTypeEdit(): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation('recommenderType')
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
      resourceName="RecommenderType"
      entityLabel={t('entity.label')}
      id={idUpdate}
    />
  )
}

export default withAuth()(withOptions(AdminRecommenderTypeEdit))
