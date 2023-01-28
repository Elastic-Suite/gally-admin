import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import RequestTypeComponent from './RequestType'

export default {
  title: 'Atoms',
  component: RequestTypeComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof RequestTypeComponent>

const mocksListRequestType = [
  {
    label: 'Catalogue product view',
    id: 'catalogue_product_view',
    isSelected: false,
    data: [],
    value: 10,
  },
  {
    label: 'Search terms',
    id: 'search_terms',
    isSelected: true,
    data: [],
    value: 20,
  },
  {
    label: 'Autocomplete box',
    id: 'autocomplete_box',
    isSelected: false,
    data: [],
    value: 30,
  },
  {
    label: 'Product bloc',
    id: 'product_bloc',
    isSelected: true,
    data: [],
    value: 40,
  },
]

const Template: ComponentStory<typeof RequestTypeComponent> = () => {
  const [multiValue, setMultiValue] = useState(
    mocksListRequestType
      .filter((item) => item.isSelected)
      .map((item) => item.value)
  )
  const [data, setData] = useState(mocksListRequestType)
  function handleChange(value: string[]): void {
    setMultiValue(value as any) // TODO
    const newData = data.map((item) =>
      value.find((val: any) => val === item.value) // TODO
        ? { ...item, isSelected: true }
        : { ...item, isSelected: false }
    )
    setData(newData)
  }

  return (
    <>
      <RequestTypeComponent
        data={data}
        handleChange={handleChange}
        multiValue={multiValue}
      />
    </>
  )
}

export const RequestType = Template.bind({})
RequestType.args = {}
