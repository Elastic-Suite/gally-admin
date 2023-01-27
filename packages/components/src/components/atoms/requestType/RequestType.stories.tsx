import React, { FormEvent, useState } from 'react'
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
  component: RequestTypeComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof RequestTypeComponent>

const mocksListRequestType: IRequestType[] = [
  {
    label: 'Catalogue product view',
    id: 'catalogue_product_view',
    isSelected: false,
    labelIsAll: 'All categories',
    data: [{ id: -1, label: 'All categories' }],
    value: 10,
    type: RequestType.CATEGORIES,
  },
  {
    label: 'Search terms',
    id: 'search_terms',
    isSelected: true,
    labelIsAll: 'All search terms',
    data: [
      { id: 1, label: 'Hello' },
      { id: 2, label: 'HelloDeux' },
      { id: 3, label: 'HelloTrois' },
    ],
    value: 20,
    type: RequestType.TAGS,
  },
  {
    label: 'Autocomplete box',
    id: 'autocomplete_box',
    isSelected: false,
    labelIsAll: 'All autocomplete box',
    data: [{ id: -1, label: 'All autocomplete box' }],
    value: 30,
    type: RequestType.TAGS,
  },
  {
    label: 'Product bloc',
    id: 'product_bloc',
    isSelected: true,
    labelIsAll: 'All product block',
    data: [{ id: 1, label: 'Product One' }],
    value: 40,
    type: RequestType.PRODUCTS,
  },
]

const Template: ComponentStory<typeof RequestTypeComponent> = () => {
  const [multiValue, setMultiValue] = useState<number[]>(
    mocksListRequestType
      .filter((item) => item.isSelected)
      .map((item) => item.value)
  )
  const [data, setData] = useState(mocksListRequestType)
  const [valCategories, setValCategories] = useState<ITreeItem[]>([])

  function handleChange(value: number[]): void {
    setMultiValue(value)
    const newData = data.map((item) =>
      value.find((val) => val === item.value)
        ? { ...item, isSelected: true }
        : { ...item, isSelected: false }
    )
    setData(newData)
  }

  const [inputVal, setInputVal] = useState<Record<string, string>>()

  function handleRemoveDataTag(idItem: string, idTag: number): void {
    const newData = data.map((item) => {
      if (item.id === idItem) {
        const newTagsList = item.data.filter((item) => item?.id !== idTag)
        return { ...item, data: newTagsList }
      }
      return item
    })

    return setData(newData)
  }

  function handleAddDataTag(
    idItem: string,
    event?: FormEvent<HTMLFormElement>
  ): void | null {
    if (event) {
      event.preventDefault()
    }

    if (inputVal?.[idItem] === undefined || inputVal?.[idItem] === '') {
      return null
    }

    const newData = data.map((item) => {
      if (item.id === idItem) {
        const newTagsList = [
          ...item.data,
          { label: inputVal?.[idItem], id: item.data.length + 1 },
        ]

        return { ...item, data: newTagsList }
      }
      return item
    })

    setData(newData)
    return setInputVal({ ...inputVal, [idItem]: '' })
  }

  function handleChangeSelectAll(idItem: string): void {
    const newData = data.map((item) => {
      if (idItem === item.id) {
        const isAllSelected = item.data.find((a) => a.id === -1)
        return {
          ...item,
          data: !isAllSelected ? [{ id: -1, label: item.labelIsAll }] : [],
        }
      }
      return item
    })
    setData(newData)
  }

  function handleChangeInput(idItem: string, value: string): void {
    return setInputVal({ ...inputVal, [idItem]: value })
  }

  return (
    <RequestTypeComponent
      data={data}
      handleChange={handleChange}
      multiValue={multiValue}
      handleChangeSelectAll={handleChangeSelectAll}
      handleRemoveDataTag={handleRemoveDataTag}
      handleAddDataTag={handleAddDataTag}
      handleChangeInput={handleChangeInput}
      inputVal={inputVal}
      dataCategories={categories.categories}
      setValCategories={setValCategories}
      valCategories={valCategories}
    />
  )
}

export const Default = Template.bind({})
Default.args = {}
