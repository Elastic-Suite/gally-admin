import React from 'react'
import { ComponentStory, Meta } from '@storybook/react'
import ScopeSearchUsage from './ScopeSearchUsage'
import { action } from '@storybook/addon-actions'
import catalogMock from '../../../../public/mocks/catalog.json'

export default {
  title: 'Molecules/ScopeSearchUsage',
  component: ScopeSearchUsage,
} as Meta

const Template: ComponentStory<typeof ScopeSearchUsage> = (args) => (
  <ScopeSearchUsage {...args} />
)

export const Default = Template.bind({})

const catalogsOptions = catalogMock['hydra:member'].flatMap((catalog) => {
  return catalog.localizedCatalogs.map((localizedCatalog) => {
    return {
      id: catalog.name,
      value: localizedCatalog['@id'],
      label: localizedCatalog.name,
    }
  })
})

Default.args = {
  catalogsOptions,
  onSubmit: (value: string): void => action('Scope submit')(value),
}
