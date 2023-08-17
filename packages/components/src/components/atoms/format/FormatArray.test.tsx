import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import FormatArray from './FormatArray'

describe('FormatArray match snapshot', () => {
  it('FormatArray Full', () => {
    const { container } = renderWithProviders(
      <FormatArray values={['blazer, jacket', 'trousers, pants']} max={1} />
    )
    expect(container).toMatchSnapshot()
  })
})
