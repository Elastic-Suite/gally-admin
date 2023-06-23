import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import DataProvider from '../../stateful-providers/DataProvider/DataProvider'

import ResourceForm from './ResourceForm'

export default {
  title: 'Stateful/ResourceForm',
  component: ResourceForm,
} as ComponentMeta<typeof ResourceForm>

const Template: ComponentStory<typeof ResourceForm> = (args) => {
  return (
    <DataProvider>
      <ResourceForm {...args} />
    </DataProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  resourceName: 'Boost',
  // id: '1',
}
