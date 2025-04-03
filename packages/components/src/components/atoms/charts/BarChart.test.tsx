import React from 'react'

import { renderWithProviders } from '../../../utils/tests'
import BarChart from './BarChart'

describe('BarChart', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <BarChart
        data={[
          { label: 'Conversion rate', value: 1, color: '#E57373' },
          { label: 'With search', value: 1, color: '#1A1AFF' },
          { label: 'Without search', value: 2, color: '#FFCDD2' },
        ]}
        label="Conversion usage"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
