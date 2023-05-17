import React from 'react'
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
  decorators: [
    (Story): JSX.Element => {
      const store = setupStore()
      return (
        <AppProvider store={store}>
          <DataProvider>
            <Story />
          </DataProvider>
        </AppProvider>
      )
    },
  ],
} as ComponentMeta<typeof ResourceForm>

const Template: ComponentStory<typeof ResourceForm> = (args) => (
  <ResourceForm {...args} />
)

export const Default = Template.bind({})
Default.args = {
  resourceName: 'SourceField',
}
