import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Router from 'next/router'
import {
  ILogin,
  isError,
  isValidUser,
  storageSet,
  tokenStorageKey,
} from '@elastic-suite/gally-admin-shared'

import { useApiFetch, useUser } from '../hooks'
import { selectRequestedPath, useAppSelector } from '../store'

import InputText from '../components/atoms/form/InputText'
import Form from '../components/atoms/form/Form'

import PageTitle from '../components/atoms/PageTitle/PageTitle'
import { styled } from '@mui/system'

const ForgoPasswordLink = styled('a')(({ theme }) => ({
  // fontWeight: 500,
  fontFamily: 'var(--gally-font)',
  lineHeight: '18px',
  fontSize: '12px',
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  color: theme.palette.colors.neutral[900],
  display: 'block',
  textDecoration: 'none',
  marginBottom: '20px',
}))

function Login(): JSX.Element {
  const { i18n, t } = useTranslation('login')
  const user = useUser()
  const requestedPath = useAppSelector(selectRequestedPath)

  const fetchApi = useApiFetch(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const redirectToRequestedPath = useCallback(
    () => Router.push(requestedPath ?? '/admin/settings/scope/catalogs'),
    [requestedPath]
  )

  useEffect(() => {
    if (isValidUser(user)) {
      redirectToRequestedPath()
    }
  }, [redirectToRequestedPath, user])

  const [showAllErrors, setShowAllErrors] = useState(false)

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    formIsValid: boolean
  ): void {
    event.preventDefault()
    if (formIsValid) {
      fetchApi<ILogin>('/authentication_token', undefined, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      }).then((json) => {
        if (!isError(json)) {
          storageSet(tokenStorageKey, json.token)
          redirectToRequestedPath()
        }
      })
    } else {
      setShowAllErrors(true)
    }
  }

  const title = t('login.title')

  return (
    <>
      <PageTitle title={title} />
      <Form onSubmit={handleSubmit} submitButtonText={t('login.action')}>
        <InputText
          autoComplete="email"
          fullWidth
          type="email"
          label={t('email.label')}
          margin="normal"
          onChange={(value: string): void => setEmail(value)}
          value={email}
          showError={showAllErrors}
          additionalValidator={(value: string): string => {
            // Used instead of required props, to not display the "required red star" just after the label.
            if (!value) return 'valueMissing'
            return ''
          }}
          replacementErrorsMessages={{
            typeMismatch: 'typeMismatchEmail',
          }}
          componentId="email"
        />
        <InputText
          autoComplete="current-password"
          fullWidth
          label={t('password.label')}
          margin="normal"
          onChange={(value: string): void => setPassword(value)}
          type="password"
          value={password}
          showError={showAllErrors}
          additionalValidator={(value: string): string => {
            // Used instead of required props, to not display the "required red star" just after the label.
            return !value ? 'valueMissing' : ''
          }}
          componentId="password"
        />
        <ForgoPasswordLink href={`/${i18n.language}/forgot-password`}>
          {t('login.forgotPassword.link')}
        </ForgoPasswordLink>
      </Form>
    </>
  )
}

export default Login
