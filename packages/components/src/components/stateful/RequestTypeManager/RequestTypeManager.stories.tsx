import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import RequestTypeManager from './RequestTypeManager'
import { IRequestType } from '@elastic-suite/gally-admin-shared'

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
  title: 'Stateful/RequestTypeManager',
  component: RequestTypeManager,
} as ComponentMeta<typeof RequestTypeManager>

const Template: ComponentStory<typeof RequestTypeManager> = (args) => {
  const [value, setValue] = useState<IRequestType>(dataGeneralBoost)

  return <RequestTypeManager {...args} value={value} onChange={setValue} />
}

export const Default = Template.bind({})
Default.args = {}
