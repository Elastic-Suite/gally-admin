import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { IRequestType } from '@elastic-suite/gally-admin-shared'
import RequestTypeItem from './RequestTypeItem'
import categoriesList from '../../../../public/mocks/categories.json'

import dataGeneralBoost from '../../../../public/mocks/requestTypes.json'
import limitationsTypes from '../../../../public/mocks/boost_limitation_type_options.json'
import requestTypesOptions from '../../../../public/mocks/boost_request_type_options.json'
import textOperatorOptions from '../../../../public/mocks/boost_query_text_operator_options.json'

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
  options: textOperatorOptions['hydra:member'],
  limitationsTypes: limitationsTypes['hydra:member'],
  requestTypesOptions: requestTypesOptions['hydra:member'],
  categoriesList: categoriesList.categories,
}
