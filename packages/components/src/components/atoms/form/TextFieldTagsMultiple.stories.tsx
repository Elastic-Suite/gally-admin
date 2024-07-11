import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldTagsComponentMultiple from './TextFieldTagsMultiple'

import {
  IOptionsTags,
  ISearchLimitations,
} from '@elastic-suite/gally-admin-shared'

const textOperatorOptions: IOptionsTags[] = [
  {
    id: 'eq',
    value: 'eq',
    label: 'is',
  },
  {
    id: '%like',
    value: '%like',
    label: 'starts with',
  },
  {
    id: '%like%',
    value: '%like%',
    label: 'contains',
  },
  {
    id: 'like%',
    value: 'like%',
    label: 'ends with',
  },
]

const searchLimitations: ISearchLimitations[] = [
  {
    '@id': '/boost_search_limitations/1',
    '@type': 'BoostSearchLimitation',
    operator: 'eq',
    queryText: 'salut',
  },
  {
    '@id': '/boost_search_limitations/1',
    '@type': 'BoostSearchLimitation',
    operator: 'eq',
    queryText: 'eq again',
  },
  {
    '@id': '/boost_search_limitations/1',
    '@type': 'BoostSearchLimitation',
    operator: '%like',
    queryText: 'TEST123',
  },
  {
    '@id': '/boost_search_limitations/1',
    '@type': 'BoostSearchLimitation',
    operator: '%like%',
    queryText: 'Hello',
  },
]

export default {
  title: 'Atoms/Form/TextFieldTagsMultiple',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: TextFieldTagsComponentMultiple,
} as ComponentMeta<typeof TextFieldTagsComponentMultiple>

const Template: ComponentStory<typeof TextFieldTagsComponentMultiple> = (
  args
) => {
  const [value, setValue] = useState<ISearchLimitations[]>(searchLimitations)

  return (
    <TextFieldTagsComponentMultiple
      {...args}
      value={value}
      onChange={setValue}
    />
  )
}

export const WithoutError = Template.bind({})
WithoutError.args = {
  disabled: false,
  options: textOperatorOptions,
  disabledValue: 'Disabled',
}

const TemplateError: ComponentStory<typeof TextFieldTagsComponentMultiple> = (
  args
) => {
  const [value, setValue] = useState<ISearchLimitations[]>(searchLimitations)

  return (
    <TextFieldTagsComponentMultiple
      {...args}
      value={value}
      onChange={setValue}
      options={textOperatorOptions}
    />
  )
}

export const Default = TemplateError.bind({})
Default.args = {
  disabled: false,
  showError: true,
  options: textOperatorOptions,
  disabledValue: 'Disabled',
}
