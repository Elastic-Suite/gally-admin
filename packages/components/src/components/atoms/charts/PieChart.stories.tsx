import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import PieChartComponent from './PieChart'

export default {
  title: 'Atoms/Charts',
  component: PieChartComponent,
} as ComponentMeta<typeof PieChartComponent>

const Template: ComponentStory<typeof PieChartComponent> = (args) => (
  <PieChartComponent {...args} />
)

export const PieChart = Template.bind({})

PieChart.args = {
  label: 'Spellcheck searches',
  infoTooltip: "Ceci est l'infoTooltip",
  data: [
    { label: 'Searches without spellcheck', value: 66.5, color: '#ED7465' },
    { label: 'Spellcheck searches', value: 33.5, color: '#2C19CD' },
  ],
  width: 600,
  height: 250,
}
