import React, { FormEvent, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldTagsComponent from './TextFieldTags'
import { ITextFieldTags } from '@elastic-suite/gally-admin-shared'

export default {
  title: 'Atoms/Form/TextFieldTags',
  component: TextFieldTagsComponent,
} as ComponentMeta<typeof TextFieldTagsComponent>

const mocksData: ITextFieldTags[] = [
  {
    label: 'Search terms',
    id: 'search_terms',
    data: [
      {
        label: 'chipOne',
        id: 1,
      },
      {
        label: 'chipTwo',
        id: 2,
      },
      {
        label: 'chipThree',
        id: 3,
      },
      {
        label: 'chipFour',
        id: 4,
      },
    ],
  },
]

const Template: ComponentStory<typeof TextFieldTagsComponent> = (args) => {
  const [data, setData] = useState(mocksData)
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

    if (inputVal?.[idItem] === undefined || inputVal?.[idItem].trim() === '') {
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

  function handleChangeInput(idItem: string, value: string): void {
    return setInputVal({ ...inputVal, [idItem]: value })
  }

  return (
    <>
      {data.map((item) => {
        return (
          <TextFieldTagsComponent
            {...args}
            data={item}
            handleRemoveDataTag={handleRemoveDataTag}
            handleAddDataTag={handleAddDataTag}
            inputVal={inputVal}
            handleChangeInput={handleChangeInput}
            key={item.id}
          />
        )
      })}
    </>
  )
}
export const Default = Template.bind({})

export const Disabled = Template.bind({})
Disabled.args = {
  isDisabled: true,
}
