import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import CustomForm from './CustomForm'

export default {
  title: 'Organisms/CustomForm',
  component: CustomForm,
  argTypes: {
    variant: {
      options: ['error', 'warning', 'info', 'success'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof CustomForm>

const Template: ComponentStory<typeof CustomForm> = (args) => <CustomForm />

export const Default = Template.bind({})
Default.args = {}
