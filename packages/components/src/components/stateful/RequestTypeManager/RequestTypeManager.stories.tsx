import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import RequestTypeManager from './RequestTypeManager'
import { IRequestType } from '@elastic-suite/gally-admin-shared'
import dataGeneralBoost from '../../../../public/mocks/requestTypes.json'
import categoriesList from '../../../../public/mocks/categories.json'

export default {
  title: 'Stateful/RequestTypeManager',
  component: RequestTypeManager,
} as ComponentMeta<typeof RequestTypeManager>

const Template: ComponentStory<typeof RequestTypeManager> = (args) => {
  const [value, setValue] = useState<IRequestType>(dataGeneralBoost)

  return <RequestTypeManager {...args} value={value} onChange={setValue} />
}

export const Default = Template.bind({})
Default.args = {
  categoriesList: categoriesList.categories,
  requestTypeConfigurations: {
    operatorOptionsApi: 'boost_query_text_operator_options',
    limitationTypeOptionsApi: 'boost_limitation_type_options',
    requestTypeOptionsApi: 'boost_request_type_options',
  },
}
