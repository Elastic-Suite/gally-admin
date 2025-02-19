import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import KPI from './KPI'

export default {
  title: 'Atoms/KPI',
  component: KPI,
} as ComponentMeta<typeof KPI>

const Template: ComponentStory<typeof KPI> = (args) => <KPI {...args} />

export const Default = Template.bind({})

Default.args = {
  label: 'searches',
  value: 68116,
}
