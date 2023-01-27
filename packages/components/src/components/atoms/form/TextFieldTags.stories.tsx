import React, { FormEvent, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldTagsComponent from './TextFieldTags'

import Checkbox from './Checkbox'

export default {
  title: 'Atoms/Form',
  component: TextFieldTagsComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof TextFieldTagsComponent>

const mocksDataTags = [
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
]

const Template: ComponentStory<typeof TextFieldTagsComponent> = () => {
  const [dataTags, setDataTags] = useState(mocksDataTags)
  const [inputVal, setInputVal] = useState<string>('')
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  function handleRemoveDataTag(id: number): void {
    const newDataTags = dataTags.filter((item) => item.id !== id)
    return setDataTags(newDataTags)
  }

  function handleAddDataTag(event?: FormEvent<HTMLFormElement>): void | null {
    if (event) {
      event.preventDefault()
    }

    if (inputVal.length === 0) {
      return null
    }

    const newDataTags = [
      ...dataTags,
      { label: inputVal, id: dataTags.length + 1 },
    ]
    setDataTags(newDataTags)
    return setInputVal('')
  }

  function handleChangeDisabled(valDisabled: boolean): void {
    if (valDisabled) {
      setDataTags([{ label: 'All search terms', id: 1 }])
    } else {
      setDataTags([])
    }
    return setIsDisabled(valDisabled)
  }

  return (
    <>
      IS disabled :{' '}
      <Checkbox checked={isDisabled} onChange={handleChangeDisabled} />
      <TextFieldTagsComponent
        dataTags={dataTags}
        handleRemoveDataTag={handleRemoveDataTag}
        handleAddDataTag={handleAddDataTag}
        inputVal={inputVal}
        setInputVal={setInputVal}
        isDisabled={isDisabled}
      />
    </>
  )
}

export const TextFieldTags = Template.bind({})
TextFieldTags.args = {}
