import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import boostWithUseResource from '../../../../public/mocks/boostWithUseResource.json'

import CustomForm from './CustomForm'
import { IResource, initResourceData } from '@elastic-suite/gally-admin-shared'
import categoriesList from '../../../../public/mocks/categories.json'
import DataProvider from '../../stateful-providers/DataProvider/DataProvider'

export default {
  title: 'Organisms/CustomForm',
  component: CustomForm,
} as ComponentMeta<typeof CustomForm>

const Template: ComponentStory<typeof CustomForm> = (args) => {
  const [data, setData] = useState<Record<string, unknown>>(
    initResourceData(boostWithUseResource as IResource)
  )
  return (
    <DataProvider>
      <CustomForm {...args} data={data} onChange={setData} />
    </DataProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  resource: boostWithUseResource,
  categoriesList: categoriesList.categories,
}
