import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import RangeWithoutError from './RangeWithoutError'
import Range from './Range'

export default {
  title: 'Atoms/Form/Range',
  component: RangeWithoutError,
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
  },
} as ComponentMeta<typeof RangeWithoutError>

const Template: ComponentStory<typeof RangeWithoutError> = (args) => {
  const [value, setValue] = useState<(number | string)[]>(['', ''])
  const handleChange = (value: (number | string)[]): void => setValue(value)
  return <RangeWithoutError {...args} value={value} onChange={handleChange} />
}

export const WithoutError = Template.bind({})
WithoutError.args = {
  color: 'primary',
  dirty: false,
  disabled: false,
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  placeholder: [],
  required: false,
  small: false,
  suffix: '',
  transparent: false,
}

const FormErrorTemplate: ComponentStory<typeof RangeWithoutError> = (args) => {
  const [value, setValue] = useState<(number | string)[]>(['', ''])
  const handleChange = (value: (number | string)[]): void => setValue(value)
  return <Range {...args} value={value} onChange={handleChange} />
}

export const Default = FormErrorTemplate.bind({})
Default.args = {
  color: 'primary',
  disabled: false,
  endAdornment: null,
  fullWidth: false,
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  placeholder: [],
  required: true,
  showError: true,
  small: false,
  suffix: '',
  transparent: false,
}
