import React from 'react'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'

import { nextI18nConfig } from '../constants'
import { setupStore } from '../store'

import AppProvider from '../components/stateful-providers/AppProvider/AppProvider'
import CatalogProvider from '../components/stateful-providers/CatalogProvider/CatalogProvider'
import DataProvider from '../components/stateful-providers/DataProvider/DataProvider'
import Layout from '../components/stateful-layout/Layout/Layout'
import { useRouter } from 'next/router'

const store = setupStore()

function GallyApp(props: AppProps): JSX.Element {
  const { Component, pageProps } = props
  const Cmp = Component
  const router = useRouter()
  const isLoginPage = router.route === '/login'

  return (
    <AppProvider store={store}>
      <DataProvider>
        <CatalogProvider>
          {isLoginPage ? (
            <Cmp {...pageProps} />
          ) : (
            <Layout>
              <Cmp {...pageProps} />
            </Layout>
          )}
        </CatalogProvider>
      </DataProvider>
    </AppProvider>
  )
}

export default appWithTranslation(GallyApp, nextI18nConfig)
