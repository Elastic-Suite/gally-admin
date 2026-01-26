import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import categoriesList from '../../../../public/mocks/categories.json'

import { IRequestType } from '@elastic-suite/gally-admin-shared'
import RequestType from './RequestType'

import dataGeneralBoost from '../../../../public/mocks/requestTypes.json'
import limitationsTypes from '../../../../public/mocks/boost_limitation_type_options.json'
import requestTypesOptions from '../../../../public/mocks/boost_request_type_options.json'
import textOperatorOptions from '../../../../public/mocks/boost_query_text_operator_options.json'

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
  options: textOperatorOptions.member,
  limitationsTypes: limitationsTypes.member,
  requestTypesOptions: requestTypesOptions.member,
  categoriesList: categoriesList.categories,
}
