import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextareaWithoutErrorComponent from './TextareaWithoutError'
import TextareaComponent from './Textarea'

export default {
  title: 'Atoms/Form/Textarea',
  component: TextareaWithoutErrorComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof TextareaWithoutErrorComponent>

const Template: ComponentStory<typeof TextareaWithoutErrorComponent> = (
  args
) => {
  const [value, setValue] = useState('')

  return (
    <TextareaWithoutErrorComponent
      {...args}
      value={value}
      onChange={setValue}
    />
  )
}

const FormErrorTemplate: ComponentStory<
  typeof TextareaWithoutErrorComponent
> = (args) => {
  const [value, setValue] = useState('')

  return (
    <TextareaComponent
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

export const WithoutError = Template.bind({})
WithoutError.args = {
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

export const Default = FormErrorTemplate.bind({})
