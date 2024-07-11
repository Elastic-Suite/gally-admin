import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import DoubleDatePickerWithoutErrorComponent, {
  IDoubleDatePickerValues,
} from './DoubleDatePickerWithoutError'
import DoubleDatePicker from './DoubleDatePicker'

export default {
  title: 'Atoms/form/DoubleDatePicker',
  component: DoubleDatePickerWithoutErrorComponent,
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
} as ComponentMeta<typeof DoubleDatePickerWithoutErrorComponent>

const Template: ComponentStory<typeof DoubleDatePickerWithoutErrorComponent> = (
  args
) => {
  const [value, setValue] = useState<IDoubleDatePickerValues>({
    fromDate: null,
    toDate: null,
  })

  function onChange(value: IDoubleDatePickerValues): void {
    setValue(value)
  }

  return (
    <DoubleDatePickerWithoutErrorComponent
      {...args}
      value={value as IDoubleDatePickerValues}
      onChange={onChange}
    />
  )
}

// This intermediate component is necessary to avoid storybook to crash when typing a value...
export const WithoutError: ComponentStory<typeof DoubleDatePicker> = (
  args: Record<string, unknown>
) => <Template {...args} />
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

const FormErrorTemplate: ComponentStory<typeof DoubleDatePicker> = (args) => {
  const [value, setValue] = useState<IDoubleDatePickerValues>({
    fromDate: null,
    toDate: null,
  })

  function onChange(value: IDoubleDatePickerValues): void {
    setValue(value)
  }

  return <DoubleDatePicker {...args} value={value} onChange={onChange} />
}

// This intermediate component is necessary to avoid storybook to crash when typing a value...
export const Default: ComponentStory<typeof DoubleDatePicker> = (
  args: Record<string, unknown>
) => <FormErrorTemplate {...args} />
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
