import Grid from '../../../../../components/stateful-pages/Grid/Grid'
import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../../hocs'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../../contexts'
import IonIcon from '../../../../../components/atoms/IonIcon/IonIcon'

const pagesSlug = ['merchandize', 'recommender', 'recommender_types']

const propsButton = {
  endIcon: <IonIcon name="add-circle-outline" />,
}

function AdminRecommenderTypeGrid(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <Grid
      resourceName="RecommenderType"
      hasNewLink
      hasEditLink
      propsButton={propsButton}
    />
  )
}

export default withAuth()(withOptions(AdminRecommenderTypeGrid))
