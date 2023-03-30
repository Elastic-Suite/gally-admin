import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import Grid from '../../../components/stateful-pages/Grid/Grid'

function AdminBoostGrid(): JSX.Element {
  return (
    <Grid
      resourceName="Boost"
      hasUpdateLink
      updateLink="./helloworldUpdate"
      newLink="./helloworldNew"
      hasNewLink
    />
  )
}

// filtres

export default withAuth(withOptions(AdminBoostGrid))
