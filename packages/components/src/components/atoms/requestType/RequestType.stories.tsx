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

const mocksDataTags = [
  {
    id: 'search_terms',
    data: ['TagsOne', 'TagsTwo'],
  },
  {
    id: 'catalogue_product_view',
    data: ['catalogue_product_view One', 'catalogue_product_view Two'],
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

  const [valTags, setValTags] =
    useState<{ id: string; data: string[] }[]>(mocksDataTags)

  function onChange(
    value?: string[] | number[] | number | ITreeItem[],
    idItem?: string
  ): void | null {
    if (Array.isArray(value)) {
      if (typeof value[0] === 'number') {
        return setMultiValue(value as number[])
      }

      if (typeof value[0] === 'string' && idItem) {
        const idIsExist = valTags.find((item) => item.id === idItem)
        if (!idIsExist) {
          const newData = [...valTags, { id: idItem, data: value as string[] }]
          return setValTags(newData)
        }
        const newData = valTags.map((item) => {
          if (item.id === idItem) {
            return { id: idItem, data: value as string[] }
          }
          return item
        })
        return setValTags(newData)
      }

      return setValCategories(value as ITreeItem[])
    }

    if (typeof value === 'number') {
      const newData = multiValue.filter((val) => val !== value)
      setMultiValue(newData)
    }

    if (!value && idItem) {
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

    return null
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
      onChange={onChange}
      multiValue={multiValue}
      valTags={valTags}
      dataCategories={categories.categories}
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
