import React, { FunctionComponent, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import {
  Role,
  getDisplayName,
  isValidRoleUser,
  isValidUser,
} from '@elastic-suite/gally-admin-shared'

import { useUser } from '../hooks'
import { setRequestedPath, useAppDispatch } from '../store'

export function withAuth<R extends Role>(requiredRole?: R) {
  return function <P extends Record<string, unknown>>(
    Cmp: FunctionComponent<P>
  ): FunctionComponent<P> {
    function WithAuth(props: P): JSX.Element {
      const { asPath } = useRouter()
      const user = useUser()
      const dispatch = useAppDispatch()

      useEffect(() => {
        const isNotValidRoleUser =
          requiredRole && !isValidRoleUser(requiredRole, user)
        if (!isValidUser(user) || isNotValidRoleUser) {
          if (isValidUser(user) && isNotValidRoleUser) {
            // Set request path to null, to avoid an infinite redirection loop.
            dispatch(setRequestedPath(null))
          } else {
            dispatch(setRequestedPath(asPath))
          }
          Router.push('/login')
        }
      }, [asPath, dispatch, user])

      if (
        !isValidUser(user) ||
        (requiredRole && !isValidRoleUser(requiredRole, user))
      ) {
        return null
      }

      return <Cmp {...props} />
    }

    WithAuth.displayName = `WithAuth(${getDisplayName(Cmp)})`
    return WithAuth
  }
}
