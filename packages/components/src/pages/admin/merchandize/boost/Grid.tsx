import Grid from '../../../../components/stateful-pages/Grid/Grid'
import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import IonIcon from '../../../../components/atoms/IonIcon/IonIcon'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['merchandize', 'boosts']

const propsButton = {
  endIcon: <IonIcon name="add-circle-outline" />,
}

function AdminBoostGrid(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('boost')

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <Grid
      resourceName="Boost"
      hasNewLink
      hasEditLink
      propsButton={propsButton}
      noAttributesProps={{
        title: t('boost.none'),
        btnTitle: t('boost.none.btn'),
        btnHref: './create',
        absoluteLink: false,
      }}
    />
  )
}

export default withAuth()(withOptions(AdminBoostGrid))
