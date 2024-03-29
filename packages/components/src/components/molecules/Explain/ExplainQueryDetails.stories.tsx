import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import ExplainQueryDetailsComponent from './ExplainQueryDetails'

export default {
  title: 'Molecules/Explain',
  component: ExplainQueryDetailsComponent,
} as ComponentMeta<typeof ExplainQueryDetailsComponent>

const Template: ComponentStory<typeof ExplainQueryDetailsComponent> = (
  args
) => <ExplainQueryDetailsComponent {...args} />

export const ExplainQueryDetails = Template.bind({})

ExplainQueryDetails.args = {
  index: 'magento2_default_catalog_product',
  query: {
    object: {
      a: 1,
      b: 2,
      c: 3,
    },
    boolean: [true, false],
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    strings: ['test', 'test 2'],
    testNull: null,
    tesUndefined: undefined,
  },
}
