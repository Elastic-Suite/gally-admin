import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import SearchTermsTableComponent from './SearchTermsTable'

export default {
  title: 'Molecules/SearchTermsTable',
  component: SearchTermsTableComponent,
} as ComponentMeta<typeof SearchTermsTableComponent>

const Template: ComponentStory<typeof SearchTermsTableComponent> = (args) => (
  <SearchTermsTableComponent {...args} />
)

export const DefaultCase = Template.bind({})

const data = [
  {
    term: 'Test 1',
    session: 1,
  },
  {
    term: 'Test 1',
    session: 1,
  },
  {
    term: 'Test 1',
    session: 1,
  },
  {
    term: 'Test 1',
    session: 1,
  },
]

DefaultCase.args = {
  data,
}
