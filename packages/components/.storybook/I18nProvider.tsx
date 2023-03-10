import React, { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n from './i18n'

interface IProps {
  children: ReactNode
}

function I18nProvider(props: IProps): JSX.Element {
  const { children } = props
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

export default I18nProvider
