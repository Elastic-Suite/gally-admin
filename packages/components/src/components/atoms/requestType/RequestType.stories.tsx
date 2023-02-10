import React, { useEffect, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import RequestTypeComponent from './RequestType'
import categories from '../../../../public/mocks/categories.json'
import {
  IRequestType,
  ITreeItem,
  RequestType,
} from '@elastic-suite/gally-admin-shared'

export default {
  title: 'Atoms/RequestType',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: RequestTypeComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof RequestTypeComponent>

const mocksListRequestType: IRequestType[] = [
  {
    label: 'Catalogue product view',
    id: 'catalogue_product_view',
    isSelected: true,
    labelIsAll: 'All categories',
    value: 10,
    type: RequestType.CATEGORIES,
    disabled: true,
  },
  {
    label: 'Search terms',
    id: 'search_terms',
    isSelected: true,
    labelIsAll: 'All search terms',
    value: 20,
    type: RequestType.TAGS,
    disabled: true,
  },
  {
    label: 'Autocomplete box',
    id: 'autocomplete_box',
    isSelected: false,
    labelIsAll: 'All autocomplete box',
    value: 30,
    type: RequestType.TAGS,
    disabled: true,
  },
  {
    label: 'Product bloc',
    id: 'product_bloc',
    isSelected: true,
    labelIsAll: 'All product block',
    value: 40,
    type: RequestType.PRODUCTS,
    disabled: true,
  },
]

const Template: ComponentStory<typeof RequestTypeComponent> = (args) => {
  const [data, setData] = useState(mocksListRequestType)

  const [valCategories, setValCategories] = useState<ITreeItem[]>([])

  const [multiValue, setMultiValue] = useState<number[]>(
    mocksListRequestType
      .filter((item) => item.isSelected)
      .map((item) => item.value)
  )
  function onChangeSelect(value: number[]): void {
    setMultiValue(value)
  }

  function onRemoveSelect(value: number): void {
    const newData = multiValue.filter((val) => val !== value)
    setMultiValue(newData)
  }

  const [valTags, setValTags] = useState<{ id: string; data: string[] }[]>([])
  function onChangeValTags(value: [string], idItem: string): void {
    const idIsExist = valTags.find((item) => item.id === idItem)
    if (!idIsExist) {
      const newData = [...valTags, { id: idItem, data: value }]
      return setValTags(newData)
    }
    const newData = valTags.map((item) => {
      if (item.id === idItem) {
        return { id: idItem, data: value }
      }
      return item
    })
    return setValTags(newData)
  }

  function onChangeSelectAll(idItem: string): void {
    const newData = data.map((item) => {
      if (idItem === item.id) {
        return {
          ...item,
          disabled: !item.disabled,
        }
      }
      return item
    })
    setData(newData)
  }

  useEffect(() => {
    const newData = data.map((item) =>
      multiValue.find((val) => val === item.value)
        ? { ...item, isSelected: true }
        : { ...item, isSelected: false }
    )
    setData(newData)
    // eslint-disable-next-line
  }, [multiValue])

  return (
    <RequestTypeComponent
      {...args}
      data={data}
      onChange={onChangeSelect}
      onRemoveSelect={onRemoveSelect}
      multiValue={multiValue}
      onChangeValTags={onChangeValTags}
      valTags={valTags}
      onChangeSelectAll={onChangeSelectAll}
      dataCategories={categories.categories}
      setValCategories={setValCategories}
      valCategories={valCategories}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  width: 200,
  margin: 'normal',
  required: true,
  helperText: 'Good',
  helperIcon: 'checkmark',
  label: 'Label',
  disabled: false,
  error: false,
  fullWidth: false,
  infoTooltip: '',
}
