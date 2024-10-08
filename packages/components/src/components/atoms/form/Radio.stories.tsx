import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FormControlLabel, Radio as RadioStorybook } from '@mui/material'

export default {
  title: 'Atoms/Form',
  component: FormControlLabel,
} as ComponentMeta<typeof FormControlLabel>

const Template: ComponentStory<typeof FormControlLabel> = (args) => (
  <FormControlLabel {...args} />
)

export const RadioWithoutError = Template.bind({})
RadioWithoutError.args = {
  disabled: false,
  value: 'id_5',
  control: <RadioStorybook defaultChecked={false} />,
  label: 'Hello world',
}
