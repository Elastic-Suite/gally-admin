import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import ConfirmPasswordComponent, {
  IConfirmPasswordValues,
} from './ConfirmPassword'

export default {
  title: 'Atoms/form/ConfirmPassword',
  component: ConfirmPasswordComponent,
  argTypes: {
    passwordLabel: {
      control: 'text',
    },
    confirmPasswordLabel: {
      control: 'text',
    },
    showError: {
      control: 'boolean',
    },
    value: {
      control: 'hidden',
    },
  },
} as ComponentMeta<typeof ConfirmPasswordComponent>

const FormErrorTemplate: ComponentStory<typeof ConfirmPasswordComponent> = (
  args
) => {
  const [value, setValue] = useState<IConfirmPasswordValues>({
    password: null,
    confirmPassword: null,
  })

  function onChange(value: IConfirmPasswordValues): void {
    setValue(value)
  }

  return (
    <ConfirmPasswordComponent {...args} value={value} onChange={onChange} />
  )
}

// This intermediate component is necessary to avoid storybook to crash when typing a value...
export const Default: ComponentStory<typeof ConfirmPasswordComponent> = (
  args: Record<string, unknown>
) => <FormErrorTemplate {...args} />

Default.args = {
  passwordLabel: null,
  confirmPasswordLabel: null,
  showError: true,
}
