import React from 'react'
import { ComponentStory, Meta } from '@storybook/react'
import ThesaurusCard from './ThesaurusCard'

export default {
  title: 'Molecules/Explain/ThesaurusCard',
  component: ThesaurusCard,
} as Meta

const Template: ComponentStory<typeof ThesaurusCard> = (args) => (
  <ThesaurusCard {...args} />
)

export const Default = Template.bind({})

Default.args = {
  title: 'Synonyms and expansions',
  terms: ['Top', 'Jacket', 'Tank'],
  button: {
    label: 'Modify thesaurus',
    url: '#',
  },
}
