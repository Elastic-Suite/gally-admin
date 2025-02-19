import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import KPIGroup from './KPIGroup'

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
