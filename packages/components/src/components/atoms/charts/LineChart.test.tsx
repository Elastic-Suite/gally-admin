import React from 'react'

import { renderWithProviders } from '../../../utils/tests'
import LineChart from './LineChart'

describe('LineChart', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <LineChart
        label="Evolution of conversion rate with search"
        infoTooltip="Ceci est l'infoTooptip"
        data={[
          {
            color: 'red',
            yPoints: [0, 100, 75, 85, 78, 50, 65],
          },
          {
            color: 'violet',
            yPoints: [100, 0, 25, 15, 22, 50, 35],
          },
        ]}
        xAxis={[0, 1, 2, 3, 4, 5, 6]}
        xLabel="Mois"
        yLabel="%"
        width="100%"
        height={300}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
