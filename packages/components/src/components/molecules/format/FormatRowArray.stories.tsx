import React from 'react'

import { ComponentMeta, ComponentStory } from '@storybook/react'

import FormatRowArray from './FormatRowArray'

export default {
  title: 'Molecules/format/FormatArray',
  component: FormatRowArray,
} as ComponentMeta<typeof FormatRowArray>

const Template: ComponentStory<typeof FormatRowArray> = (args) => (
  <FormatRowArray {...args} />
)

export const Default = Template.bind({})
Default.args = {
  values: ['blazer', 'jacket', 'trousers', 'pants'],
  multipleValueFormat: { separator: ', ', maxCount: 2 },
}
