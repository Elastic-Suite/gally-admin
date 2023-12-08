import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import PreviewGridBoostConfigurationComponent from './PreviewGridBoostConfiguration'

export default {
  title: 'Atoms/Form/PreviewGridBoostConfiguration',
  component: PreviewGridBoostConfigurationComponent,
} as ComponentMeta<typeof PreviewGridBoostConfigurationComponent>

const Template: ComponentStory<
  typeof PreviewGridBoostConfigurationComponent
> = () => {
  return <PreviewGridBoostConfigurationComponent />
}

export const PreviewGridBoostConfiguration = Template.bind({})
