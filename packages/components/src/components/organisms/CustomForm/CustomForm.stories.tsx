import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import boostWithUseResource from '../../../../public/mocks/boostWithUseResource.json'

import CustomForm from './CustomForm'
import { IResource, initResourceData } from '@elastic-suite/gally-admin-shared'
import categoriesList from '../../../../public/mocks/categories.json'

export default {
  title: 'Organisms/CustomForm',
  component: CustomForm,
} as ComponentMeta<typeof CustomForm>

const Template: ComponentStory<typeof CustomForm> = (args) => {
  const [data, setData] = useState<Record<string, unknown>>(
    initResourceData(boostWithUseResource as IResource)
  )

  return <CustomForm {...args} data={data} onChange={setData} />
}

export const Default = Template.bind({})
Default.args = {
  resource: boostWithUseResource,
  categoriesList: categoriesList.categories,
}
