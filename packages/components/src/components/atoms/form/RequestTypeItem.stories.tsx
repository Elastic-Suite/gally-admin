import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import {
  ILimitationsTypes,
  IOptions,
  IRequestType,
  IRequestTypesOptions,
} from '@elastic-suite/gally-admin-shared'
import RequestTypeItem from './RequestTypeItem'

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

const requestTypesOptions: IRequestTypesOptions[] = [
  {
    label: 'Product catalog',
    limitation_type: 'category',
    id: 'a',
    value: 'product_catalog',
  },
  {
    label: 'Search terms',
    limitation_type: 'search',
    id: 'aa',
    value: 'product_search',
  },
  {
    label: 'Autocomplete terms',
    limitation_type: 'search',
    id: 'aaa',
    value: 'product_autocomplete',
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

const dataGeneralBoost: IRequestType = {
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
    {
      '@id': '/boost_request_types/2',
      '@type': 'BoostRequestType',
      requestType: 'product_search',
      applyToAll: false,
    },
    {
      '@id': '/boost_request_types/3',
      '@type': 'BoostRequestType',
      requestType: 'product_autocomplete',
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
  title: 'Atoms/Form/RequestTypeItem',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: RequestTypeItem,
} as ComponentMeta<typeof RequestTypeItem>

const Template: ComponentStory<typeof RequestTypeItem> = (args) => {
  const [value, setValue] = useState<IRequestType>(dataGeneralBoost)

  return <RequestTypeItem {...args} value={value} onChange={setValue} />
}

export const Default = Template.bind({})
Default.args = {
  options: textOperatorOptions,
  limitationsTypes,
  requestTypesOptions,
}
