import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import BarChartComponent from './BarChart'

export default {
  title: 'Atoms/Charts',
  component: BarChartComponent,
} as ComponentMeta<typeof BarChartComponent>

const Template: ComponentStory<typeof BarChartComponent> = (args) => (
  <BarChartComponent {...args} />
)

export const BarChart = Template.bind({})

BarChart.args = {
  label: 'Conversion usage',
  data: [
    { label: 'Conversion rate', value: 1, color: '#E57373' },
    { label: 'With search', value: 1, color: '#1A1AFF' },
    { label: 'Without search', value: 2, color: '#FFCDD2' },
  ],
}
