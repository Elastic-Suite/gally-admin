import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import KPI from './KPI'

describe('KPI match snapshot', () => {
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

  it('KPI simple', () => {
    const { container } = renderWithProviders(
      <KPI label="Test simple value" value={4998} />
    )
    expect(container).toMatchSnapshot()
  })

  it('KPI percentage', () => {
    const { container } = renderWithProviders(
      <KPI label="Test percentage value" value={49.98} isPercentage />
    )
    expect(container).toMatchSnapshot()
  })
})
