import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldTagsComponentMultiple from './TextFieldTagsMultiple'
import {
  IOptions,
  ILimitationsTypes,
  IRequestType,
} from '@elastic-suite/gally-admin-shared'
import TextFieldTagsItem from './TextFieldTagsItem'

const limitationsTypes: ILimitationsTypes[] = [
  {
    label: 'Product catalog',
    labelAll: 'All Products catalogs',
    value: 'category',
  },
  {
    label: 'Search terms',
    labelAll: 'All Search terms',
    value: 'search',
  },
]

const textOperatorOptions: IOptions<string> = [
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

export const dataGeneralBoost: IRequestType = {
  '@id': '/boosts/1',
  '@type': 'Boost',
  id: 1,
  name: 'My First Boost',
  isActive: true,
  model: 'constant_score',
  modelConfig:
    '{"scale_factor":"1","constant_score_value":"23","scale_function":""}',
  localizedCatalogs: ['/localized_catalogs/19', '/localized_catalogs/20'],
  requestTypes: [
    {
      '@id': '/boost_request_types/1',
      '@type': 'BoostRequestType',
      requestType: 'product_catalog',
      applyToAll: false,
    },
  ],
  categoryLimitations: [
    {
      '@id': '/boost_category_limitations/1',
      '@type': 'BoostCategoryLimitation',
      category: '/categories/cat_2',
    },
  ],
  searchLimitations: [
    {
      '@id': '/boost_search_limitations/1',
      '@type': 'BoostSearchLimitation',
      operator: 'eq',
      queryText: 'EQ',
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
      queryText: '%like',
    },
    {
      '@id': '/boost_search_limitations/1',
      '@type': 'BoostSearchLimitation',
      operator: '%like%',
      queryText: '%like%',
    },
    {
      '@id': '/boost_search_limitations/1',
      '@type': 'BoostSearchLimitation',
      operator: 'like%',
      queryText: 'like%',
    },
  ],
  createdAt: '2023-03-01T10:42:15+00:00',
  updatedAt: '2023-03-01T10:42:15+00:00',
}

export default {
  title: 'Atoms/Form/TextFieldTagsItem',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: TextFieldTagsItem,
} as ComponentMeta<typeof TextFieldTagsItem>

const Template: ComponentStory<typeof TextFieldTagsItem> = (args) => {
  console.log('args', args)
  const [value, setValue] = useState<IRequestType>(dataGeneralBoost)

  return <TextFieldTagsItem {...args} value={value} onChange={setValue} />
}

export const Default = Template.bind({})
Default.args = {
  options: textOperatorOptions,
  limitationsType: limitationsTypes,
}
