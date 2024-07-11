import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import DropDownWithoutErrorComponent from './DropDownWithoutError'
import DropDown from './DropDown'

export default {
  title: 'Atoms/Form/Dropdown',
  component: DropDownWithoutErrorComponent,
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
} as ComponentMeta<typeof DropDownWithoutErrorComponent>

export const SimpleWithoutError: ComponentStory<
  typeof DropDownWithoutErrorComponent
> = (args) => {
  const [value, setValue] = useState('')
  const handleChange = (value: string): void => setValue(value)
  return (
    <DropDownWithoutErrorComponent
      {...args}
      onChange={handleChange}
      value={value}
    />
  )
}
SimpleWithoutError.args = {
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
  options: [
    { label: 'Ten', value: 10 },
    { label: 'Twenty', value: 20 },
    { label: 'Thirty', value: 30 },
    { label: 'Fourty', value: 40, disabled: true },
    { label: 'Fifty', value: 50 },
  ],
  required: false,
  small: false,
  transparent: false,
}

export const MultipleWithoutError: ComponentStory<
  typeof DropDownWithoutErrorComponent
> = (args): JSX.Element => {
  const [multiValue, setMultiValue] = useState([])
  const handleChange = (value: string[]): void => setMultiValue(value)
  return (
    <DropDownWithoutErrorComponent
      {...args}
      multiple
      onChange={handleChange}
      value={multiValue}
    />
  )
}
MultipleWithoutError.args = {
  color: 'primary',
  dirty: false,
  disabled: false,
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'Label',
  limitTags: 2,
  margin: 'none',
  options: [
    { label: 'Ten', value: 10 },
    { label: 'Twenty', value: 20 },
    { label: 'Thirty', value: 30 },
    { label: 'Fourty', value: 40, disabled: true },
    { label: 'Fifty', value: 50 },
  ],
  required: false,
  small: false,
  transparent: false,
}

export const Default: ComponentStory<typeof DropDown> = (args) => {
  const [value, setValue] = useState('')
  const handleChange = (value: string): void => setValue(value)
  return <DropDown {...args} onChange={handleChange} value={value} />
}
Default.args = {
  color: 'primary',
  disabled: false,
  fullWidth: false,
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  options: [
    { label: 'Ten', value: 10 },
    { label: 'Twenty', value: 20 },
    { label: 'Thirty', value: 30 },
    { label: 'Fourty', value: 40, disabled: true },
    { label: 'Fifty', value: 50 },
  ],
  required: true,
  showError: true,
  small: false,
  transparent: false,
}
