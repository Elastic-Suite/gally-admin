import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldTagsWithoutErrorComponent from './TextFieldTagsWithoutError'
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
  component: TextFieldTagsWithoutErrorComponent,
} as ComponentMeta<typeof TextFieldTagsWithoutErrorComponent>

const Template: ComponentStory<typeof TextFieldTagsWithoutErrorComponent> = (
  args
) => {
  const [value, setValue] = useState<string[]>([])
  return (
    <TextFieldTagsWithoutErrorComponent
      {...args}
      value={value}
      onChange={setValue}
    />
  )
}

export const WithoutError = Template.bind({})
WithoutError.args = {
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

const TemplateError: ComponentStory<
  typeof TextFieldTagsWithoutErrorComponent
> = (args) => {
  const [value, setValue] = useState<string[]>([])
  return <TextFieldTagsComponent {...args} value={value} onChange={setValue} />
}

export const Default = TemplateError.bind({})
Default.args = {
  margin: 'normal',
  required: true,
  label: 'Label',
  disabled: false,
  fullWidth: false,
  infoTooltip: '',
  size: 'small',
  disabledValue: 'DisabledValue',
  placeholder: 'Placeholder',
  showError: true,
  withCleanButton: true,
}
