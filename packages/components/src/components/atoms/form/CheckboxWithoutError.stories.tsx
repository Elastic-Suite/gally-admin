import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import CheckboxComponent from './CheckboxWithoutError'

export default {
  title: 'Atoms/Form',
  component: CheckboxComponent,
} as ComponentMeta<typeof CheckboxComponent>

const Template: ComponentStory<typeof CheckboxComponent> = (args) => {
  const [checked, setChecked] = useState(false)
  return <CheckboxComponent {...args} checked={checked} onChange={setChecked} />
}

export const CheckboxWithoutError = Template.bind({})
CheckboxWithoutError.args = {
  indeterminate: false,
  label: 'Label',
  list: false,
}
