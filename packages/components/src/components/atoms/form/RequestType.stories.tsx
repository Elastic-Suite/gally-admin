import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import categoriesList from '../../../../public/mocks/categories.json'

import {
  ILimitationsTypes,
  IOptions,
  IRequestType,
  IRequestTypesOptions,
} from '@elastic-suite/gally-admin-shared'
import RequestType from './RequestType'

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
    limitationType: 'category',
    id: 'product_catalog',
    value: 'product_catalog',
  },
  {
    label: 'Search terms',
    limitationType: 'search',
    id: 'product_search',
    value: 'product_search',
  },
  {
    label: 'Autocomplete terms',
    limitationType: 'search',
    id: 'Autocomplete_terms',
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
      category: '/categories/one',
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
  ],
  createdAt: '2023-03-01T10:42:15+00:00',
  updatedAt: '2023-03-01T10:42:15+00:00',
}

export default {
  title: 'Atoms/Form/RequestType',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: RequestType,
} as ComponentMeta<typeof RequestType>

const Template: ComponentStory<typeof RequestType> = (args) => {
  const [value, setValue] = useState<IRequestType>(dataGeneralBoost)

  return <RequestType {...args} value={value} onChange={setValue} />
}

export const Default = Template.bind({})
Default.args = {
  options: textOperatorOptions,
  limitationsTypes,
  requestTypesOptions,
  categoriesList: categoriesList.categories,
}
