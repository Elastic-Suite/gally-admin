import React from 'react'

import { ComponentMeta, ComponentStory } from '@storybook/react'

import FormatArray from './FormatArray'

export default {
  title: 'Atoms/format/FormatArray',
  component: FormatArray,
} as ComponentMeta<typeof FormatArray>

const Template: ComponentStory<typeof FormatArray> = (args) => (
  <FormatArray {...args} />
)

export const Default = Template.bind({})
Default.args = {
  values: ['blazer, jacket', 'trousers, pants'],
  max: 1,
}
