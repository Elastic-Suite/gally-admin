import React from 'react'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'

import { nextI18nConfig } from '../constants'
import { setupStore } from '../store'

import AppProvider from '../components/stateful-providers/AppProvider/AppProvider'
import DataProvider from '../components/stateful-providers/DataProvider/DataProvider'
import Layout from '../components/stateful-layout/Layout/Layout'

const store = setupStore()

function GallyApp(props: AppProps): JSX.Element {
  const { Component, pageProps } = props
  const Cmp = Component

  return (
    <AppProvider store={store}>
      <DataProvider>
        <Layout>
          <Cmp {...pageProps} />
        </Layout>
      </DataProvider>
    </AppProvider>
  )
}

export default appWithTranslation(GallyApp, nextI18nConfig)
