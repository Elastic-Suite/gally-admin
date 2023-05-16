import { PreloadedState } from '@reduxjs/toolkit'
import {
  Bundle,
  LoadStatus,
  useSchemaLoader,
} from '@elastic-suite/gally-admin-shared'

import { RootState } from '../store'
import { renderHookWithProviders } from '../utils/tests'

import { useFetchApi } from './useApi'
import { useDataLoader } from './useDataLoader'

jest.mock('./useApi', () => ({
  useApiFetch: jest.fn(),
  useFetchApi: jest.fn((): unknown => [
    {
      data: {
        'hydra:member': [
          {
            id: 'GallyVirtualCategoryBundle',
            name: 'GallyVirtualCategoryBundle',
          },
        ],
      },
    },
  ]),
}))

const preloadedState: PreloadedState<RootState> = {
  data: {
    api: null,
    bundles: null,
    configurations: null,
    metadata: null,
  },
}

describe('useDataLoader', () => {
  it('should load the data in the store', () => {
    const { store } = renderHookWithProviders(() => useDataLoader(), {
      preloadedState,
    })
    const state = store.getState()
    expect(state.data).toEqual({
      api: 'api',
      bundles: [Bundle.VIRTUAL_CATEGORY],
      configurations: {
        GallyVirtualCategoryBundle: undefined,
      },
      metadata: [
        {
          id: 'GallyVirtualCategoryBundle',
          name: 'GallyVirtualCategoryBundle',
        },
      ],
    })
  })

  it("should not update the store if data won't load (api)", () => {
    const mock = useSchemaLoader as jest.Mock
    mock.mockClear()
    mock.mockImplementationOnce(() => ({
      error: 'error',
      status: LoadStatus.FAILED,
    }))
    const { store } = renderHookWithProviders(() => useDataLoader(), {
      preloadedState,
    })
    const state = store.getState()
    expect(state.data).toEqual({
      api: null,
      bundles: null,
      configurations: null,
      metadata: null,
    })
  })

  it("should not update the store if data won't load (bundles)", () => {
    const mock = useFetchApi as jest.Mock
    mock.mockClear()
    mock.mockImplementationOnce(() => [
      { error: 'error', status: LoadStatus.FAILED },
    ])
    const { store } = renderHookWithProviders(() => useDataLoader(), {
      preloadedState,
    })
    const state = store.getState()
    expect(state.data).toEqual({
      api: null,
      bundles: null,
      configurations: null,
      metadata: null,
    })
  })
})
