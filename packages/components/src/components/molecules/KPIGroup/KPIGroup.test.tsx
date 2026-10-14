import React from 'react'
import { TFunction } from 'next-i18next'

import { renderWithProviders } from '../../../utils/tests'

import KPIGroup, { getKpiGroupItems } from './KPIGroup'
import { IKPI } from '../KpiLoader/KpiLoader'

describe('KPIGroup match snapshot', () => {
  beforeAll(() => {
    jest
      .spyOn(Number.prototype, 'toLocaleString')
      .mockImplementation(function (this: number, _locale, options) {
        return new Intl.NumberFormat('fr-FR', options).format(this)
      })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('KPIGroup', () => {
    const { container } = renderWithProviders(
      <KPIGroup
        kpis={[
          {
            id: 1,
            label: 'Test 1',
            value: 456,
          },
          {
            id: 2,
            label: 'Test 2',
            value: 46.86,
            isPercentage: true,
          },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('getKpiGroupItems', () => {
  it('maps a KPI to group items', () => {
    const t = ((key: string): string => `t_${key}`) as unknown as TFunction
    expect(
      getKpiGroupItems(
        {
          '@id': '/kpis/1',
          '@type': 'Kpi',
          id: 1,
          localizedCatalog: 'com_fr',
          searchCount: 12,
          sessionsWithSearchPercentage: 40.5,
          valueFormat: { sessionsWithSearchPercentage: 'percentage' },
        } as IKPI,
        t
      )
    ).toEqual([
      {
        id: '1_0',
        componentId: 'searchCount',
        label: 't_searchCount',
        value: 12,
        isPercentage: false,
      },
      {
        id: '1_1',
        componentId: 'sessionsWithSearchPercentage',
        label: 't_sessionsWithSearchPercentage',
        value: 40.5,
        isPercentage: true,
      },
    ])
  })
})
