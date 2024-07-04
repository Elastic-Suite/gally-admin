import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Router from 'next/router'
import Head from 'next/head'
import { styled } from '@mui/system'
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
import Image from 'next/image'

const CustomRoot = styled('div')({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  background: 'rgb(250, 251, 254)',
})

const CustomImg = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '32px',
})

const CustomBloc = styled('div')({
  padding: '32px',
  marginBottom: '6%',
  border: '1px solid rgb(226, 230, 243)',
  borderRadius: '8px',
  background: 'rgb(255, 255, 255)',
})

function Login(): JSX.Element {
  const { t } = useTranslation('login')
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

  const title = t('title.login')

  return (
    <CustomRoot>
      <Head>
        <title>{title}</title>
      </Head>
      <CustomBloc>
        <CustomImg>
          <Image
            src="/images/LogoBlinkExtended.svg"
            alt="Logo"
            width="150"
            height="45"
          />
        </CustomImg>
        <PageTitle title={title} />
        <Form onSubmit={handleSubmit} submitButtonText={t('action.login')}>
          <InputText
            autoComplete="email"
            fullWidth
            label={t('label.email')}
            margin="normal"
            onChange={(value: string): void => setEmail(value)}
            value={email}
            showError={showAllErrors}
            additionalValidator={(value: string): string => {
              if (!value) return 'valueMissing'
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              return emailRegex.test(value) ? '' : 'patternMismatch'
            }}
          />
          <InputText
            autoComplete="current-password"
            fullWidth
            label={t('label.password')}
            margin="normal"
            onChange={(value: string): void => setPassword(value)}
            type="password"
            value={password}
            showError={showAllErrors}
            additionalValidator={(value: string): string => {
              return !value ? 'valueMissing' : ''
            }}
          />
        </Form>
      </CustomBloc>
    </CustomRoot>
  )
}

export default Login
