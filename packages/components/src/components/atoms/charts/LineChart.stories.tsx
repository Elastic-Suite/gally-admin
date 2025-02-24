import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import LineChartComponent from './LineChart'

export default {
  title: 'Atoms/Charts',
  component: LineChartComponent,
} as ComponentMeta<typeof LineChartComponent>

const Template: ComponentStory<typeof LineChartComponent> = (args) => (
  <LineChartComponent {...args} />
)

export const LineChart = Template.bind({})

LineChart.args = {
  label: 'Evolution of conversion rate with search',
  infoTooltip: "Ceci est l'infoTooptip",
  data: [
    {
      color: 'red',
      yPoints: [0, 100, 75, 85, 78, 50, 65],
    },
    {
      color: 'violet',
      yPoints: [100, 0, 25, 15, 22, 50, 35],
    },
  ],
  xAxis: [0, 1, 2, 3, 4, 5, 6],
  xLabel: 'Mois',
  yLabel: '%',
  width: '100%',
  height: 300,
}
