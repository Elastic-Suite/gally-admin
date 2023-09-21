import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import SearchBarComponent from './SearchBar'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Atoms/Form/SearchBar',
  component: SearchBarComponent,
} as ComponentMeta<typeof SearchBarComponent>

const Template: ComponentStory<typeof SearchBarComponent> = ({
  value,
  ...args
}) => {
  const [val, setVal] = useState(value)
  const sendFilter = action('send Filter')

  return (
    <SearchBarComponent
      {...args}
      value={val}
      onChange={setVal}
      onResearch={(): void => sendFilter(val)}
    />
  )
}

export const SearchBar = Template.bind({})

SearchBar.args = {
  value: '',
  placeholder: 'Rechercher',
}
