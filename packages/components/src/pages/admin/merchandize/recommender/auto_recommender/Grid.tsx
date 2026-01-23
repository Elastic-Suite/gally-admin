import Grid from '../../../../../components/stateful-pages/Grid/Grid'
import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../../hocs'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../../contexts'
import IonIcon from '../../../../../components/atoms/IonIcon/IonIcon'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['merchandize', 'recommender', 'auto_recommender']

const propsButton = {
  endIcon: <IonIcon name="add-circle-outline" />,
}

function AdminAutoRecommenderGrid(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('recommender')

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <Grid
      resourceName="Recommender"
      hasNewLink
      hasEditLink
      propsButton={propsButton}
      noAttributesProps={{
        title: t('recommender.none'),
        btnTitle: t('recommender.none.btn'),
        btnHref: './create',
        absoluteLink: false,
      }}
      title={t('recommender.title')}
    />
  )
}

export default withAuth()(withOptions(AdminAutoRecommenderGrid))
