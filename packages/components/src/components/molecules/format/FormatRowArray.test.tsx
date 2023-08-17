import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import FormatRowArray from './FormatRowArray'

describe('FormatRowArray match snapshot', () => {
  it('FormatRowArray Full', () => {
    const { container } = renderWithProviders(
      <FormatRowArray
        values={['blazer', 'jacket', 'trousers', 'pants']}
        multipleValueFormat={{ separator: ', ', maxCount: 2 }}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('FormatRowArray maxCount=1', () => {
    const { container } = renderWithProviders(
      <FormatRowArray
        values={['blazer', 'jacket', 'trousers', 'pants']}
        multipleValueFormat={{ separator: ', ', maxCount: 1 }}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('FormatRowArray without maxCount', () => {
    const { container } = renderWithProviders(
      <FormatRowArray
        values={['blazer', 'jacket', 'trousers', 'pants']}
        multipleValueFormat={{ separator: ', ', maxCount: 1 }}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('FormatRowArray without separator', () => {
    const { container } = renderWithProviders(
      <FormatRowArray
        values={['blazer', 'jacket', 'trousers', 'pants']}
        multipleValueFormat={{ maxCount: 1 }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
