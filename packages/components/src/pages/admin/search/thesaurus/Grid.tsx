import Grid from '../../../../components/stateful-pages/Grid/Grid'
import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'
import IonIcon from '../../../../components/atoms/IonIcon/IonIcon'
import { useTranslation } from 'next-i18next'

const pagesSlug = ['search', 'thesaurus']

const propsButton = {
  endIcon: <IonIcon name="add-circle-outline" />,
}

function AdminThesaurusGrid(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('thesaurus')

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <Grid
      resourceName="Thesaurus"
      hasNewLink
      hasEditLink
      propsButton={propsButton}
      noAttributesProps={{
        title: t('thesaurus.none'),
        btnTitle: t('thesaurus.none.btn'),
        btnHref: './create',
        absoluteLink: false,
      }}
    />
  )
}

export default withAuth()(withOptions(AdminThesaurusGrid))
