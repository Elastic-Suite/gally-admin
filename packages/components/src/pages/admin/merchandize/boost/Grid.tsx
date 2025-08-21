import Grid from '../../../../components/stateful-pages/Grid/Grid'
import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../../src/contexts'
import IonIcon from '../../../../components/atoms/IonIcon/IonIcon'

const pagesSlug = ['merchandize', 'boosts']

const propsButton = {
  endIcon: <IonIcon name="add-circle-outline" />,
}

function AdminBoostGrid(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <Grid
      resourceName="Boost"
      hasNewLink
      hasEditLink
      propsButton={propsButton}
    />
  )
}

export default withAuth()(withOptions(AdminBoostGrid))
