import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import Button from '../buttons/Button'

import PopIn from './PopIn'

export default {
  title: 'Atoms/Modals',
  component: PopIn,
} as ComponentMeta<typeof PopIn>

const Template: ComponentStory<typeof PopIn> = ({ children, ...args }) => (
  <PopIn {...args}>{children}</PopIn>
)

const handleClick = (text: string): void => {
  // eslint-disable-next-line no-console
  console.log(text)
}
export const Pop_In = Template.bind({})
Pop_In.args = {
  triggerElement: <Button size="large">Click on me !</Button>,
  actions: (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <Button onClick={(): void => handleClick('Bouton 1')}>Bouton 1</Button>
      <Button onClick={(): void => handleClick('Bouton 2')}>Bouton 2</Button>
    </div>
  ),
  children: 'Contenu de la PopIn',
  styles: {
    paper: {},
    title: {},
    content: {},
    actions: {},
  },
}
