import Grid from '../../../../components/stateful-pages/Grid/Grid'
import React, { useContext, useEffect } from 'react'
import { withAuth, withOptions } from '../../../../hocs'
import { useRouter } from 'next/router'
import { breadcrumbContext } from '../../../../contexts'

const pagesSlug = ['search', 'thesaurus']

const propsButton = {
  endIcon: <ion-icon name="add-circle-outline" />,
}

function AdminThesaurusGrid(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  return (
    <Grid
      resourceName="Thesaurus"
      hasNewLink
      hasEditLink
      propsButton={propsButton}
    />
  )
}

export default withAuth(withOptions(AdminThesaurusGrid))
