import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import Grid from '../../../components/stateful-pages/Grid/Grid'

function AdminBoostGrid(): JSX.Element {
  return (
    <Grid resourceName="Boost" hasNewLink hasUpdateLink updateLink="update" />
  )
}

export default withAuth(withOptions(AdminBoostGrid))
