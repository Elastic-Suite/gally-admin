import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import Boost from './Boost'

describe('Boost', () => {
  it('Should match snapschot', () => {
    const infos = {
      type: 'down' as 'up' | 'down' | 'straight',
      boostNumber: 1,
      boostMultiplicator: 1.1,
    }
    const { container } = renderWithProviders(<Boost {...infos} />)
    expect(container).toMatchSnapshot()
  })
})
