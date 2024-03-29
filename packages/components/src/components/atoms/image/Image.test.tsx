import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import Image from './Image'
import { ImageIcon } from '@elastic-suite/gally-admin-shared'

describe('Score', () => {
  it('Should match snapschot', () => {
    const { container } = renderWithProviders(
      <Image
        image={{
          path: 'media/catalog/product/v/d/vd11-ly_main.jpg',
          icons: [ImageIcon.PIN],
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
