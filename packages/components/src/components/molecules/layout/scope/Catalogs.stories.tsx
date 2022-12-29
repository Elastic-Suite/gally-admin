import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import catalog from '../../../../../public/mocks/catalog.json'

import Catalogs from './Catalogs'

export default {
  title: 'Molecules/Scopes',
  component: Catalogs,
} as ComponentMeta<typeof Catalogs>

const Template: ComponentStory<typeof Catalogs> = (args) => (
  <Catalogs {...args} />
)

export const Catalog = Template.bind({})
Catalog.args = {
  content: catalog,
}
