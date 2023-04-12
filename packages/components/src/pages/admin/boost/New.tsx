import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import { useResource } from '../../../../src/hooks'

function AdminBoostNew(): JSX.Element {
  const a = useResource('Boost')
  console.log(a)
  return <div>Salut</div>
}

export default withAuth(withOptions(AdminBoostNew))
