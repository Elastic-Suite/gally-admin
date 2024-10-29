import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import KPIGroup from './KPIGroup'

export default {
  title: 'Molecules/KPIGroup',
  component: KPIGroup,
} as ComponentMeta<typeof KPIGroup>

const Template: ComponentStory<typeof KPIGroup> = (args) => (
  <KPIGroup {...args} />
)

export const Default = Template.bind({})

Default.args = {
  kpis: [
    {
      id: 1,
      label: 'searches',
      value: 68116,
    },
    {
      id: 2,
      label: 'sessions',
      value: 139271,
    },
    {
      id: 3,
      label: 'sessions with search',
      value: 28.6,
      isPercentage: true,
    },
    {
      id: 4,
      label: 'search per session',
      value: 1.7,
    },
    {
      id: 5,
      label: 'session with search',
      value: 28.6,
      isPercentage: true,
    },
    {
      id: 6,
      label: 'searches',
      value: 68116,
    },
  ],
}
