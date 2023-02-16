import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldTagsComponent from './TextFieldTags'

export default {
  title: 'Atoms/Form/TextFieldTags',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: TextFieldTagsComponent,
} as ComponentMeta<typeof TextFieldTagsComponent>

const Template: ComponentStory<typeof TextFieldTagsComponent> = (args) => {
  const [value, setValue] = useState<string[]>([])
  return <TextFieldTagsComponent {...args} value={value} onChange={setValue} />
}

export const Default = Template.bind({})
Default.args = {
  margin: 'normal',
  required: true,
  helperText: 'HelperText',
  helperIcon: 'information-circle',
  label: 'Label',
  disabled: false,
  error: false,
  fullWidth: false,
  infoTooltip: '',
  size: 'small',
  disabledValue: 'DisabledValue',
  placeholder: 'Placeholder',
}
