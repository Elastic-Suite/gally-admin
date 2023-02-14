import React, { FormEvent, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldTagsComponent from './TextFieldTags'
import { ITextFieldTags } from '@elastic-suite/gally-admin-shared'

export default {
  title: 'Atoms/Form/TextFieldTags',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: TextFieldTagsComponent,
} as ComponentMeta<typeof TextFieldTagsComponent>

const mocksData: ITextFieldTags[] = [
  {
    label: 'Search terms',
    id: 'search_terms',
    data: [
      {
        label: 'chipOne',
        id: -1,
      },
      {
        label: 'chipTwo',
        id: -1,
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

  function onRemoveDataTag(idItem: string, idTag: number): void {
    const newData = data.map((item) => {
      if (item.id === idItem) {
        const newTagsList = item.data.filter((item) => item?.id !== idTag)
        return { ...item, data: newTagsList }
      }
      return item
    })

    return setData(newData)
  }

  function generateId(
    listItems: { label: string; id: number }[],
    index?: number
  ): number {
    let count = index ?? 0

    if (listItems.find((item) => item.id === count)) {
      return generateId(listItems, ++count)
    }
    return count
  }

  function onAddDataTag(idItem: string): void | null {
    if (inputVal?.[idItem] === undefined || inputVal?.[idItem].trim() === '') {
      return null
    }

    const newData = data.map((item) => {
      if (item.id === idItem) {
        const createId = generateId(item.data)
        const newTagsList = [
          ...item.data,
          { label: inputVal?.[idItem], id: createId },
        ]

        return { ...item, data: newTagsList }
      }
      return item
    })

    setData(newData)
    return setInputVal({ ...inputVal, [idItem]: '' })
  }

  function onChangeInput(idItem: string, value: string): void {
    return setInputVal({ ...inputVal, [idItem]: value })
  }

  function onChange(
    idItem: string,
    idTag?: number,
    event?: FormEvent<HTMLFormElement>,
    value?: string
  ): void | null {
    if (idItem && value) {
      return onChangeInput(idItem, value)
    }

    if (event) {
      event.preventDefault()
      return onAddDataTag(idItem)
    }

    return onRemoveDataTag(idItem, idTag as number)
  }

  return (
    <>
      {data.map((item) => {
        const value = inputVal?.[item.id]
        return (
          <TextFieldTagsComponent
            {...args}
            key={item.id}
            data={item}
            onChange={onChange}
            value={value}
          />
        )
      })}
    </>
  )
}
export const Default = Template.bind({})
Default.args = {
  margin: 'normal',
  required: true,
  helperText: 'Good',
  helperIcon: 'information-circle',
  label: 'Label',
  disabled: false,
  error: false,
  fullWidth: false,
  infoTooltip: '',
  size: 'small',
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  size: 'small',
}
