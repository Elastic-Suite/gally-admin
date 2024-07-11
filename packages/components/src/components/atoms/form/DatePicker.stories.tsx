import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import DatePickerWithoutErrorComponent from './DatePickerWithoutError'
import DatePicker from './DatePicker'

export default {
  title: 'Atoms/form/DatePicker',
  component: DatePickerWithoutErrorComponent,
  argTypes: {
    color: {
      options: ['none', 'success', 'error'],
      mapping: {
        none: null,
        success: 'success',
        error: 'error',
      },
      control: { type: 'select' },
    },
    helperIcon: {
      options: ['', 'information-circle', 'checkmark', 'close'],
      control: { type: 'select' },
    },
    helperText: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
    value: {
      control: 'hidden',
    },
  },
} as ComponentMeta<typeof DatePickerWithoutErrorComponent>

const Template: ComponentStory<typeof DatePickerWithoutErrorComponent> = (
  args
) => {
  const [value, setValue] = useState<Date | null>(null)

  function onChange(value: Date | null): void {
    setValue(value)
  }

  return (
    <DatePickerWithoutErrorComponent
      {...args}
      value={value}
      onChange={onChange}
    />
  )
}

export const WithoutError = Template.bind({})
WithoutError.args = {
  color: 'primary',
  disabled: false,
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  required: false,
  small: false,
  transparent: false,
}

const FormErrorTemplate: ComponentStory<typeof DatePicker> = (args) => {
  const [value, setValue] = useState<Date | null>(null)

  function onChange(value: Date | null): void {
    setValue(value)
  }

  return <DatePicker {...args} value={value} onChange={onChange} />
}

export const Default = FormErrorTemplate.bind({})
Default.args = {
  color: 'primary',
  disabled: false,
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  required: true,
  showError: true,
  small: false,
  transparent: false,
}
