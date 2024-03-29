import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import ImageComponent from './Image'
import { ImageIcon } from '@elastic-suite/gally-admin-shared'

export default {
  title: 'Atoms/Image',
  component: ImageComponent,
} as ComponentMeta<typeof ImageComponent>

const Template: ComponentStory<typeof ImageComponent> = (args) => (
  <ImageComponent {...args} />
)

export const Image = Template.bind({})
Image.args = {
  image: {
    path: 'media/catalog/product/v/d/vd11-ly_main.jpg',
    icons: [ImageIcon.PIN],
  },
}
