import React, { FormEvent, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldTagsComponent from './TextFieldTags'

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

const Template: ComponentStory<typeof TextFieldTagsComponent> = (args) => {
  const [data, setData] = useState<string[]>([])

  function onChange(
    data: string[],
    event?: FormEvent<HTMLFormElement>
  ): void | null {
    if (event) {
      event.preventDefault()
    }
    return setData(data)
  }

  return <TextFieldTagsComponent {...args} data={data} onChange={onChange} />
}
export const Default = Template.bind({})
Default.args = {
  margin: 'normal',
  required: true,
  helperText: 'HelperText',
  helperIcon: 'information-circle',
  label: 'Label',
  disabled: false,
  error: false,
  fullWidth: false,
  infoTooltip: '',
  size: 'small',
  disabledValue: 'DisabledValue',
  placeholder: 'Placeholder',
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  size: 'small',
}
