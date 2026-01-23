import Grid from '../../../../../components/stateful-pages/Grid/Grid'
import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../../hocs'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../../contexts'
import IonIcon from '../../../../../components/atoms/IonIcon/IonIcon'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['merchandize', 'recommender', 'recommender_type']

const propsButton = {
  endIcon: <IonIcon name="add-circle-outline" />,
}

function AdminRecommenderTypeGrid(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('recommenderType')

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <Grid
      resourceName="RecommenderType"
      hasNewLink
      hasEditLink
      propsButton={propsButton}
      noAttributesProps={{
        title: t('recommender_type.none'),
        btnTitle: t('recommender_type.none.btn'),
        btnHref: './create',
        absoluteLink: false,
      }}
      title={t('recommender_type.title')}
    />
  )
}

export default withAuth()(withOptions(AdminRecommenderTypeGrid))
