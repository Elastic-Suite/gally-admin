import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import boostData from '../../../../public/mocks/boostData.json'

import CustomForm from './CustomForm'

export default {
  title: 'Organisms/CustomForm',
  component: CustomForm,
} as ComponentMeta<typeof CustomForm>

const Template: ComponentStory<typeof CustomForm> = (args) => {
  const [data, setData] = useState<Record<string, unknown>>() // boostData

  function handleChange(name: string, response: any) {
    if (name === 'doubleDatePicker') {
      const formatDate = { fromDate: response?.from, toDate: response?.to }

      return setData({ ...data, ...formatDate })
    }
    return setData({ ...data, [name]: response })
  }
  return <CustomForm {...args} data={data} handleChange={handleChange} />
}

export const Default = Template.bind({})
Default.args = {
  resourceName: 'Boost',
}
