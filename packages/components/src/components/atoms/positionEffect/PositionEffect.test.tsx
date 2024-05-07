import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import PositionEffect from './PositionEffect'

describe('PositionEffect', () => {
  it('Should match snapschot', () => {
    const props = {
      positionEffect: {
        type: 'down' as 'up' | 'down' | 'straight',
      },
    }
    const { container } = renderWithProviders(<PositionEffect {...props} />)
    expect(container).toMatchSnapshot()
  })
})
