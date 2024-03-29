import React from 'react'

import { ComponentMeta, ComponentStory } from '@storybook/react'

import FormatText from './FormatText'

export default {
  title: 'Atoms/format/FormatText',
  component: FormatText,
} as ComponentMeta<typeof FormatText>

const Template: ComponentStory<typeof FormatText> = (args) => (
  <FormatText {...args} />
)

export const Default = Template.bind({})
Default.args = {
  name: 'ma limite de charactères est de 28. Vous ne pourrez pas voir ce texte en entier',
  toolTip: true,
  firstLetterUpp: true,
}

export const NoToolTip = Template.bind({})
NoToolTip.args = {
  name: 'ma limite de charactères est de 28. Vous ne pourrez pas voir ce texte en entier',
}
