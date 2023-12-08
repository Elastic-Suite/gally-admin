import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import FiltersPreviewBoostingTabsComponent from './FiltersPreviewBoostingTabs'
import categoriesMock from '../../../../public/mocks/categories.json'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Molecules/FiltersPreviewBoostingTabs',
  component: FiltersPreviewBoostingTabsComponent,
} as ComponentMeta<typeof FiltersPreviewBoostingTabsComponent>

const Template: ComponentStory<typeof FiltersPreviewBoostingTabsComponent> = (
  args
) => {
  return <FiltersPreviewBoostingTabsComponent {...args} />
}

export const FiltersPreviewBoostingTabs = Template.bind({})

FiltersPreviewBoostingTabs.args = {
  categories: categoriesMock.categories,
  onSendFilter: action('send filter'),
}
