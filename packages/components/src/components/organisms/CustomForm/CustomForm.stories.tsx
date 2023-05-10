import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import boostWithUseResource from '../../../../public/mocks/boostWithUseResource.json'

import CustomForm from './CustomForm'

export default {
  title: 'Organisms/CustomForm',
  component: CustomForm,
} as ComponentMeta<typeof CustomForm>

const Template: ComponentStory<typeof CustomForm> = (args) => {
  const [data, setData] = useState<Record<string, unknown>>()

  return <CustomForm {...args} data={data} onChange={setData} />
}

export const Default = Template.bind({})
Default.args = {
  resource: boostWithUseResource,
}
