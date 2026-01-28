import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../../hocs'
import { ResourceForm } from '../../../../../components'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../../contexts'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['merchandize', 'recommender', 'recommender_type']

function AdminRecommenderTypeCreate(): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation('recommenderType')
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <ResourceForm
      title={t('title.create')}
      resourceName="RecommenderType"
      entityLabel={t('entity.label')}
    />
  )
}

export default withAuth()(withOptions(AdminRecommenderTypeCreate))
