import React, { ReactNode } from 'react'
import { RenderOptions, render, renderHook } from '@testing-library/react'
import { PreloadedState } from '@reduxjs/toolkit'
import { Bundle, api } from '@elastic-suite/gally-admin-shared'

import { AppStore, RootState, setupStore } from '../store'

import AppProvider from '../components/stateful-providers/AppProvider/AppProvider'

import TestProvider from './TestProvider'

export interface IExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppStore
}

export interface IRenderOutput {
  store: AppStore
}

const defaultState = {
  data: {
    api,
    bundles: [Bundle.VIRTUAL_CATEGORY],
    configurations: {
      'base_url/media': 'https://localhost/media/catalog/product/',
    },
    metadata: [
      {
        '@id': '/metadata/3',
        '@type': 'Metadata',
        id: 3,
        entity: 'product',
        sourceFields: ['/source_fields/217', '/source_fields/253'],
      },
      {
        '@id': '/metadata/4',
        '@type': 'Metadata',
        id: 4,
        entity: 'category',
        sourceFields: ['/source_fields/254', '/source_fields/286'],
      },
    ],
  },
  user: {
    requestedPath: '',
  },
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = defaultState,
    store,
    ...renderOptions
  }: IExtendedRenderOptions = {}
) {
  store = store ?? setupStore(preloadedState)
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <AppProvider store={store}>
        <TestProvider>{children}</TestProvider>
      </AppProvider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function renderHookWithProviders<R>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hook: (props: any) => R,
  {
    preloadedState = defaultState,
    store,
    ...renderOptions
  }: IExtendedRenderOptions = {}
) {
  store = store ?? setupStore(preloadedState)
  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <AppProvider store={store}>
        <TestProvider>{children}</TestProvider>
      </AppProvider>
    )
  }
  return { store, ...renderHook(hook, { wrapper: Wrapper, ...renderOptions }) }
}
