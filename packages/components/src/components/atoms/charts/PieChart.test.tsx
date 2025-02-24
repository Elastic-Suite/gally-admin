import React from 'react'

import { renderWithProviders } from '../../../utils/tests'
import PieChart from './PieChart'

describe('PieChart', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <PieChart
        label="Spellcheck searches"
        infoTooltip="Ceci est l'infoTooltip"
        data={[
          {
            label: 'Searches without spellcheck',
            value: 66.5,
            color: '#ED7465',
          },
          { label: 'Spellcheck searches', value: 33.5, color: '#2C19CD' },
        ]}
        width={600}
        height={250}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
