import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import PreviewBoostingTableComponent from './PreviewBoostingTable'
import productsMock from '../../../../public/mocks/boosts_preview_bags_search.json'

export default {
  title: 'Organisms/PreviewBoostingTable',
  component: PreviewBoostingTableComponent,
} as ComponentMeta<typeof PreviewBoostingTableComponent>

const Template: ComponentStory<typeof PreviewBoostingTableComponent> = (
  args
) => {
  return <PreviewBoostingTableComponent {...args} />
}

export const PreviewBoostingTable = Template.bind({})

PreviewBoostingTable.args = {
  productsBefore: productsMock.data.previewBoost.resultsBefore,
  productsAfter: productsMock.data.previewBoost.resultsAfter,
}
