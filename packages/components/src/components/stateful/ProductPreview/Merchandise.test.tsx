import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import MerchandiseBar from './MerchandiseBar'

describe('MerchandiseBar match snapshot', () => {
  it('MerchandiseBar', () => {
    const { container } = renderWithProviders(
      <MerchandiseBar nbResults={25} nbTopProducts={2} />
    )
    expect(container).toMatchSnapshot()
  })
})
