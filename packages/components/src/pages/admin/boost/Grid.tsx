import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import Grid from '../../../components/stateful-pages/Grid/Grid'

function AdminBoostGrid(): JSX.Element {
  return <Grid resourceName="Boost" />
}

export default withAuth(withOptions(AdminBoostGrid))
