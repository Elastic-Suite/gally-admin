import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import SearchTermsTableComponent from './SearchTermsTable'
import { useTranslation } from 'next-i18next'

export default {
  title: 'Molecules/SearchTermsTable',
  component: SearchTermsTableComponent,
} as ComponentMeta<typeof SearchTermsTableComponent>

function WithTranslation({
  data,
  title,
}: React.ComponentProps<typeof SearchTermsTableComponent>): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const count = data.length
  return (
    <SearchTermsTableComponent
      title={title || t('resultsSearchItems', { count })!}
      data={data}
    />
  )
}
const Template: ComponentStory<typeof SearchTermsTableComponent> = (args) => {
  return <WithTranslation {...args} />
}

export const DefaultCase = Template.bind({})

const data = [
  {
    term: 'Colle cleopatre pour slime',
    session: 6,
  },
  {
    term: 'Classeur pokemon',
    session: 4,
  },
  {
    term: 'Grimoire vierge',
    session: 1,
  },
  {
    term: 'Chromecast',
    session: 6,
  },
]

DefaultCase.args = {
  data,
}
