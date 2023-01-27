import React, { FunctionComponent, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { getDisplayName, isValidUser } from '@elastic-suite/gally-admin-shared'

import { useUser } from '../hooks'
import { setRequestedPath, useAppDispatch } from '../store'

export function withAuth<P extends Record<string, unknown>>(
  Cmp: FunctionComponent<P>
): FunctionComponent<P> {
  function WithAuth(props: P): JSX.Element {
    const { asPath } = useRouter()
    const user = useUser()
    const dispatch = useAppDispatch()

    useEffect(() => {
      if (!isValidUser(user)) {
        dispatch(setRequestedPath(asPath))
        Router.push('/login')
      }
    }, [asPath, dispatch, user])

    if (!isValidUser(user)) {
      return null
    }

    return <Cmp {...props} />
  }

  WithAuth.displayName = `WithAuth(${getDisplayName(Cmp)})`
  return WithAuth
}
