import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import PositionEffectComponent from './PositionEffect'

export default {
  title: 'Atoms/PositionEffect',
  component: PositionEffectComponent,
} as ComponentMeta<typeof PositionEffectComponent>

const Template: ComponentStory<typeof PositionEffectComponent> = (args) => (
  <PositionEffectComponent {...args} />
)

export const PositionEffect = Template.bind({})
PositionEffect.args = {
  positionEffect: {
    type: 'down' as 'up' | 'down' | 'straight',
  },
}
