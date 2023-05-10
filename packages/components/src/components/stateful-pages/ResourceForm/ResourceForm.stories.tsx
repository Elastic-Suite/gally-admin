import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
// import boostData from '../../../../public/mocks/boostData.json'
// import boostWithUseResource from '../../../../public/mocks/boostWithUseResource.json'
import DataProvider from '../../stateful-providers/DataProvider/DataProvider'
import AppProvider from '../../stateful-providers/AppProvider/AppProvider'
import { setupStore } from '../../../store'

import ResourceForm from './ResourceForm'

export default {
  title: 'Stateful/ResourceForm',
  component: ResourceForm,
} as ComponentMeta<typeof ResourceForm>

const Template: ComponentStory<typeof ResourceForm> = (args) => {
  const store = setupStore()
  return (
    <AppProvider store={store}>
      <DataProvider>
        <ResourceForm {...args} />
      </DataProvider>
    </AppProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  resourceName: 'SourceField',
}
