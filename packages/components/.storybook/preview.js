import React, { Suspense } from 'react'
import { RouterContext } from 'next/dist/shared/lib/router-context'

import { api } from '@elastic-suite/gally-admin-shared'

import { setupStore } from '../src/store'
import TestProvider from '../src/utils/TestProvider'
import AppProvider from '../src/components/stateful-providers/AppProvider/AppProvider'

import I18nProvider from './I18nProvider'
import StoryProvider from './StoryProvider'

import '../assets/scss/style.scss'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    matchers: {
      color: /color$/i,
      date: /date$/i,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
}

export const decorators = [
  (Story, context) => {
    const store = setupStore({
      data: {
        api,
      },
    })
    return (
      <Suspense fallback="">
        <I18nProvider>
          <AppProvider store={store}>
            <StoryProvider locale={context.globals.locale}>
              <TestProvider>
                <Story />
              </TestProvider>
            </StoryProvider>
          </AppProvider>
        </I18nProvider>
      </Suspense>
    )
  },
]

export const globalTypes = {
  locale: {
    name: 'Locale',
    title: 'Locale',
    description: 'Global locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'fr', right: '🇫🇷', title: 'Français' },
      ],
      dynamicTitle: true,
    },
  },
}
