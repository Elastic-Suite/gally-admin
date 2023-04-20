import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import boostData from '../../../../public/mocks/boostData.json'
import boostWithUseResource from '../../../../public/mocks/boostWithUseResource.json'

import CustomForm from './CustomForm'

export default {
  title: 'Organisms/CustomForm',
  component: CustomForm,
} as ComponentMeta<typeof CustomForm>

const Template: ComponentStory<typeof CustomForm> = (args) => {
  const [data, setData] = useState<Record<string, unknown>>() // boostData if it's for updateForm

  return <CustomForm {...args} data={data} setData={setData} />
}

export const Default = Template.bind({})
Default.args = {
  resourceData: boostWithUseResource, // make useResource(resourceName) for use it out storybook
}
