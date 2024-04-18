import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextareaComponent from './Textarea'
import TextareaErrorComponent from './TextareaError'

export default {
  title: 'Atoms/Form',
  component: TextareaComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof TextareaComponent>

const Template: ComponentStory<typeof TextareaComponent> = (args) => {
  const [value, setValue] = useState('')

  return <TextareaComponent {...args} value={value} onChange={setValue} />
}

const FormErrorTemplate: ComponentStory<typeof TextareaComponent> = (args) => {
  const [value, setValue] = useState('')

  return (
    <TextareaErrorComponent
      {...args}
      label="Textarea with error"
      value={value}
      onChange={setValue}
      showError
      required
      additionalValidator={(value): string => {
        return value === 'oui' ? 'erreur' : ''
      }}
    />
  )
}

export const Textarea = Template.bind({})
Textarea.args = {
  error: false,
  disabled: false,
  fullWidth: false,
  id: 'textarea',
  label: 'Label',
  margin: 'none',
  maxLength: 250,
  placeholder: 'Describe your issue',
  required: false,
  resizable: false,
}

export const withError = FormErrorTemplate.bind({})
