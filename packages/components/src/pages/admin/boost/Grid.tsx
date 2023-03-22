import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { withAuth, withOptions } from '../../../hocs'
import { breadcrumbContext } from '../../../contexts'

const pagesSlug = ['boost', 'grid']

function AdminBoostGrid(): JSX.Element {
  const router = useRouter()

  const [, setBreadcrumb] = useContext(breadcrumbContext)
  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  // todo: temporary page
  return <div>Dashboard</div>
}

export default withAuth(withOptions(AdminBoostGrid))
