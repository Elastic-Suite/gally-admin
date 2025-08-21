import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import DataProvider from '../../stateful-providers/DataProvider/DataProvider'

import ConfigurationForm from './ConfigurationForm'

export default {
  title: 'Stateful/ResourceForm',
  component: ConfigurationForm,
} as ComponentMeta<typeof ConfigurationForm>

// todo: il faut arbitrer sur l'utilité ou non de créer une story pour le composant ConfigurationForm, si ce n'est pas utile supprimer ce fichier !
const Template: ComponentStory<typeof ConfigurationForm> = (args) => {
  return (
    <DataProvider>
      <ConfigurationForm {...args} />
    </DataProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  resourceName: 'Boost',
  // id: '1',
}
