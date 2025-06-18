import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Router, { useRouter } from 'next/router'
import { ILogin, isError, isValidUser } from '@elastic-suite/gally-admin-shared'

import { useApiFetch, useUser } from '../hooks'
import { selectRequestedPath, useAppSelector } from '../store'

import Form from '../components/atoms/form/Form'

import PageTitle from '../components/atoms/PageTitle/PageTitle'
import ConfirmPassword from '../components/atoms/form/ConfirmPassword'
import { closeSnackbar, enqueueSnackbar } from 'notistack'

function ResetPassword(): JSX.Element {
  const { t } = useTranslation('login')
  const user = useUser()
  const router = useRouter()
  const requestedPath = useAppSelector(selectRequestedPath)

  const fetchApi = useApiFetch(false)
  const [confirmPassword, setConfirmPassword] = useState({
    password: '',
    confirmPassword: '',
  })
  const [token, setToken] = useState<string>('')
  const [showAllErrors, setShowAllErrors] = useState(false)

  const redirectToRequestedPath = useCallback(
    () => Router.push(requestedPath ?? '/login'),
    [requestedPath]
  )

  useEffect(() => {
    if (isValidUser(user)) {
      redirectToRequestedPath()
    }
    const token = router?.query?.token as string
    if (token) {
      fetchApi<ILogin>(
        `/forgot_password/${token}`,
        undefined,
        {
          method: 'GET',
          headers: new Headers({ 'Content-Type': 'application/json' }),
        },
        false
      ).then((json) => {
        if (!isError(json)) {
          setToken(token)
        }
      })
    }
  }, [redirectToRequestedPath, user, router.query, setToken, fetchApi])

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    formIsValid: boolean
  ): void {
    event.preventDefault()
    if (formIsValid) {
      fetchApi<ILogin>(
        `/forgot_password/${token}`,
        undefined,
        {
          method: 'POST',
          body: JSON.stringify({ password: confirmPassword.password }),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        },
        false
      ).then((json) => {
        if (!isError(json)) {
          redirectToRequestedPath()
          enqueueSnackbar(t('resetPassword.message.success'), {
            onShut: closeSnackbar,
            variant: 'success',
          })
        } else {
          enqueueSnackbar(t('resetPassword.message.error'), {
            onShut: closeSnackbar,
            variant: 'error',
            autoHideDuration: null,
          })
        }
      })
    } else {
      setShowAllErrors(true)
    }
  }

  const title = t('resetPassword.title')

  return (
    <>
      <PageTitle title={title} />
      {token ? (
        <Form
          onSubmit={handleSubmit}
          submitButtonText={t('resetPassword.action')}
        >
          <ConfirmPassword
            value={confirmPassword}
            onChange={(value): void => setConfirmPassword(value)}
            showError={showAllErrors}
          />
        </Form>
      ) : (
        t('resetPassword.token.error')
      )}
    </>
  )
}

export default ResetPassword
