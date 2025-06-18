import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Router, { useRouter } from 'next/router'
import { ILogin, isError, isValidUser } from '@elastic-suite/gally-admin-shared'

import { useApiFetch, useUser } from '../hooks'
import { selectRequestedPath, useAppSelector } from '../store'

import InputText from '../components/atoms/form/InputText'
import Form from '../components/atoms/form/Form'

import PageTitle from '../components/atoms/PageTitle/PageTitle'

function ForgotPassword(): JSX.Element {
  const { i18n, t } = useTranslation('login')
  const user = useUser()
  const router = useRouter()
  const requestedPath = useAppSelector(selectRequestedPath)

  const fetchApi = useApiFetch(false)
  const [email, setEmail] = useState('')
  const [requestSent, setRequestSent] = useState<boolean>(false)

  const redirectToRequestedPath = useCallback(
    () => Router.push(requestedPath ?? '/login'),
    [requestedPath]
  )

  useEffect(() => {
    if (isValidUser(user)) {
      redirectToRequestedPath()
    }
  }, [redirectToRequestedPath, user, router.query])

  const [showAllErrors, setShowAllErrors] = useState(false)

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    formIsValid: boolean
  ): void {
    event.preventDefault()
    if (formIsValid) {
      fetchApi<ILogin>('/forgot_password/', undefined, {
        method: 'POST',
        body: JSON.stringify({ email, language: i18n.language }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      }).then((json) => {
        if (!isError(json)) {
          setRequestSent(true)
        }
      })
    } else {
      setShowAllErrors(true)
    }
  }

  const title = t('forgotPassword.title')

  return (
    <>
      <PageTitle title={title} />
      {requestSent ? (
        <span>{t('forgotPassword.message.success')}</span>
      ) : (
        <>
          <span>{t('forgotPassword.description')}</span>
          <Form
            onSubmit={handleSubmit}
            submitButtonText={t('forgotPassword.action')}
          >
            <InputText
              autoComplete="email"
              fullWidth
              type="email"
              label={t('email.label')}
              margin="normal"
              onChange={(value: string): void => setEmail(value)}
              value={email}
              showError={showAllErrors}
              required
              additionalValidator={(value: string): string => {
                if (!value) return 'valueMissing'
                return ''
              }}
              replacementErrorsMessages={{
                typeMismatch: 'typeMismatchEmail',
              }}
              componentId="forgotPasswordEmailInput"
            />
          </Form>
        </>
      )}
    </>
  )
}

export default ForgotPassword
