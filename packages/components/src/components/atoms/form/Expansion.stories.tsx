import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { IExpansions } from '@elastic-suite/gally-admin-shared'
import Expansion from './Expansion'

import ThesaurusExpansion from '../../../../public/mocks/thesaurus_expansion.json'

export default {
  title: 'Atoms/Form/Expansion',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: Expansion,
} as ComponentMeta<typeof Expansion>

const Template: ComponentStory<typeof Expansion> = (args) => {
  const [value, setValue] = useState<IExpansions>(ThesaurusExpansion.expansions)

  return (
    <Expansion {...args} value={value} label="Expansions" onChange={setValue} />
  )
}

export const Default = Template.bind({})
Default.args = {}
