import React from 'react'

import { useTranslation } from 'next-i18next'

import InputText from './InputText'

export interface IConfirmPasswordValues {
  password: string | null
  confirmPassword: string | null
}

export interface IConfirmPasswordProps {
  value?: IConfirmPasswordValues
  passwordLabel?: string
  confirmPasswordLabel?: string
  onChange?: (values: IConfirmPasswordValues) => void
  showError?: boolean
}

function ConfirmPassword(props: IConfirmPasswordProps): JSX.Element {
  const { value, passwordLabel, confirmPasswordLabel, onChange, showError } =
    props
  const { t } = useTranslation('common')

  function onChangePassword(password: string): void {
    onChange({ ...value, password })
  }

  function onChangeConfirmPassword(confirmPassword: string): void {
    onChange({ ...value, confirmPassword })
  }

  return (
    <>
      <InputText
        fullWidth
        label={t(passwordLabel ?? 'newPassword.label')}
        margin="normal"
        onChange={onChangePassword}
        type="password"
        value={value?.password}
        showError={showError}
        required
      />
      <InputText
        fullWidth
        label={t(confirmPasswordLabel ?? 'confirmPassword.label')}
        margin="normal"
        onChange={onChangeConfirmPassword}
        type="password"
        value={value?.confirmPassword}
        showError={showError}
        required
        additionalValidator={(valueToValidate: string): string => {
          return valueToValidate !== value?.password ? 'mismatchPassword' : ''
        }}
      />
    </>
  )
}

export default ConfirmPassword
