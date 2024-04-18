import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import categories from '../../../../public/mocks/categories.json'

import TreeSelectorComponent from './TreeSelector'
import TreeSelectorErrorComponent from './TreeSelectorError'

export default {
  title: 'Atoms/Form/TreeSelector',
  component: TreeSelectorComponent,
  argTypes: {
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
} as ComponentMeta<typeof TreeSelectorComponent>

export const Simple: ComponentStory<typeof TreeSelectorComponent> = (args) => {
  const [value, setValue] = useState(null)
  return (
    <TreeSelectorComponent
      {...args}
      value={value}
      multiple={false}
      onChange={setValue}
    />
  )
}
Simple.args = {
  data: categories.categories,
  label: 'Label',
  required: false,
  disabled: false,
  small: false,
  transparent: false,
}

export const Multiple: ComponentStory<typeof TreeSelectorComponent> = (
  args
) => {
  const [value, setValue] = useState([])
  return (
    <TreeSelectorComponent
      {...args}
      value={value}
      multiple
      onChange={setValue}
    />
  )
}
Multiple.args = {
  data: categories.categories,
  disabled: false,
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  placeholder: '',
  required: false,
  small: false,
  transparent: false,
}

export const MultipleWithError: ComponentStory<typeof TreeSelectorComponent> = (
  args
) => {
  const [value, setValue] = useState([])
  return (
    <TreeSelectorErrorComponent
      {...args}
      value={value}
      multiple
      onChange={setValue}
    />
  )
}

MultipleWithError.args = {
  data: categories.categories,
  required: true,
  showError: true,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  placeholder: '',
  small: false,
  transparent: false,
}
