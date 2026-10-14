import React from 'react'
import { waitFor } from '@testing-library/react'
import {
  Bundle,
  IResource,
  LoadStatus,
  api,
  fetchApi,
} from '@elastic-suite/gally-admin-shared'

import { renderWithProviders } from '../../../utils/tests'
import { IKpiFiltersContext, kpiFiltersContext } from '../../../contexts'

import KpiLoader, {
  IKpiLoaderResult,
  IKpiTermList,
  IKpiZeroResultTerm,
  readTermList,
} from './KpiLoader'

const apiFilters = { localizedCatalog: 'com_fr', startDate: '2025-01-10' }
const kpis = [{ '@id': '/kpis/1', '@type': 'Kpi', id: 1, searchCount: 12 }]

// The mocked API docs do not declare Kpi, so the tests add it.
const kpiResource = {
  '@id': 'https://localhost/docs.jsonld#Kpi',
  title: 'Kpi',
  url: 'https://localhost/kpis',
  supportedProperty: [],
} as unknown as IResource
const stateWithKpi = {
  data: {
    api: [...api, kpiResource],
    bundles: [] as Bundle[],
    configurations: {},
  },
  user: { requestedPath: '' },
}

describe('KpiLoader', () => {
  beforeEach(() => {
    ;(fetchApi as jest.Mock).mockClear()
    ;(fetchApi as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ 'hydra:member': kpis })
    )
  })

  it('loads the resource with the context filters', async () => {
    const children = jest.fn((_result: IKpiLoaderResult): null => null)
    const onLoad = jest.fn()

    renderWithProviders(
      <kpiFiltersContext.Provider
        value={
          {
            apiFilters,
            trackLoading: (): (() => void) => (): void => undefined,
          } as unknown as IKpiFiltersContext
        }
      >
        <KpiLoader resourceName="Kpi" onLoad={onLoad}>
          {children}
        </KpiLoader>
      </kpiFiltersContext.Provider>,
      { preloadedState: stateWithKpi }
    )

    await waitFor(() =>
      expect(onLoad).toHaveBeenLastCalledWith({
        kpis,
        status: LoadStatus.SUCCEEDED,
        error: undefined,
      })
    )
    expect(fetchApi).toHaveBeenCalledTimes(1)
    expect((fetchApi as jest.Mock).mock.calls[0][1].url).toBe(
      'https://localhost/kpis'
    )
    expect((fetchApi as jest.Mock).mock.calls[0][2]).toEqual(apiFilters)

    const statuses = children.mock.calls.map(([result]) => result.status)
    expect(statuses).toContain(LoadStatus.LOADING)
    expect(statuses[statuses.length - 1]).toBe(LoadStatus.SUCCEEDED)
  })

  it('does not call the API root when the resource is not declared', async () => {
    const children = jest.fn((_result: IKpiLoaderResult): null => null)

    renderWithProviders(
      <kpiFiltersContext.Provider
        value={
          {
            apiFilters: { catalog: 'com' },
            trackLoading: (): (() => void) => (): void => undefined,
          } as unknown as IKpiFiltersContext
        }
      >
        <KpiLoader resourceName="NotDeclared">{children}</KpiLoader>
      </kpiFiltersContext.Provider>
    )

    await waitFor(() => expect(children).toHaveBeenCalled())
    expect(fetchApi).not.toHaveBeenCalled()
    const statuses = children.mock.calls.map(([result]) => result.status)
    expect(statuses).not.toContain(LoadStatus.LOADING)
  })
})

describe('readTermList', () => {
  // hydra:member of GET /kpi/zero_result, as the API returns it.
  const zeroResult: IKpiTermList<IKpiZeroResultTerm>[] = [
    {
      id: 'kpi_zero_result_terms_1',
      localizedCatalog: 'com_en',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      help: 'Searches with no result.',
      terms: [{ term: 'chromecast', sessionCount: 3, visitorCount: 2 }],
    },
  ]

  it('reads the help and terms of the single member', () => {
    expect(readTermList(zeroResult)).toBe(zeroResult[0])
  })

  it('returns no terms when the collection is empty', () => {
    expect(readTermList([])).toEqual({ help: null, terms: [] })
  })
})
