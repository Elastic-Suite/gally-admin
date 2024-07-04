import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import RadioGrpWithoutError from './RadioGroupWithoutError'

export default {
  title: 'Atoms/Form',
  component: RadioGrpWithoutError,
} as ComponentMeta<typeof RadioGrpWithoutError>

const Template: ComponentStory<typeof RadioGrpWithoutError> = (args) => (
  <RadioGrpWithoutError {...args} />
)

export const RadioGroup = Template.bind({})
RadioGroup.args = {
  name: 'radio-buttons-group',
  defaultChecked: true,
  row: true,
  options: [
    { value: 'male', label: 'Label One', disabled: true },
    { value: 'female', label: 'Label Two' },
  ],
}
