import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import Grid from '../../../components/stateful-pages/Grid/Grid'

function AdminBoostGrid(): JSX.Element {
  return (
    <Grid
      title="Adrien tié le boss"
      resourceName="Boost"
      hasUpdateLink
      updateLink="./helloworldUpdate"
      newLink="./helloworldNew"
      hasNewLink
    />
  )
}

export default withAuth(withOptions(AdminBoostGrid))
