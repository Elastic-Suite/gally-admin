import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ISynonyms } from '@elastic-suite/gally-admin-shared'
import Synonym from './Synonym'

import ThesaurusSynonym from '../../../../public/mocks/thesaurus_synonym.json'

export default {
  title: 'Atoms/Form/Synonym',
  helperIcon: {
    options: ['', 'information-circle', 'checkmark', 'close'],
    control: { type: 'select' },
  },
  helperText: {
    control: 'text',
  },
  component: Synonym,
} as ComponentMeta<typeof Synonym>

const Template: ComponentStory<typeof Synonym> = (args) => {
  const [value, setValue] = useState<ISynonyms>(ThesaurusSynonym.synonyms)

  return <Synonym {...args} value={value} label="Synoyms" onChange={setValue} />
}

export const Default = Template.bind({})
Default.args = {}
