import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldTagsComponentMultiple from './TextFieldTagsMultiple'
import {
  ILimitations,
  IOptionsTags,
  ITransformedLimitations,
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

const searchLimitations: ILimitations[] = [
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
  const [value, setValue] = useState<ITransformedLimitations>(
    transformedValue(searchLimitations)
  )
  function transformedValue(tableau: ILimitations[]): ITransformedLimitations {
    const transformedObject: ITransformedLimitations = {}
    tableau.map((item) => {
      if (transformedObject[item.operator]) {
        return transformedObject[item.operator].push(item.queryText)
      }
      return (transformedObject[item.operator] = [item.queryText])
    })
    return transformedObject
  }

  function onChange(
    operator: string | string[],
    data?: string[] | string
  ): void {
    if (Array.isArray(operator)) {
      return setValue({ ...value, [operator.toString()]: [] })
    }

    if (typeof operator === 'string' && typeof data === 'string') {
      const newValue = { ...value }
      newValue[data] = newValue[operator]
      delete newValue[operator]
      return setValue(newValue)
    }

    if (!data) {
      const newValue = { ...value }
      delete newValue[operator as string]
      return setValue(newValue)
    }
    return setValue({ ...value, [operator as string]: data as string[] })
  }

  return (
    <TextFieldTagsComponentMultiple
      {...args}
      options={textOperatorOptions}
      value={value}
      onChange={onChange}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  disabled: true,
}
