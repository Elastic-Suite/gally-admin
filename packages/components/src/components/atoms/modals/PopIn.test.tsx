import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import Button from '../buttons/Button'

import PopIn from './PopIn'

describe('PopIn match snapshot', () => {
  it('PopIn simple', () => {
    const { container } = renderWithProviders(
      <PopIn
        position="center"
        confirmationPopIn
        triggerElement={<Button size="large">Click on me !</Button>}
        cancelName="Cancel"
        confirmName="Confirm"
        titlePopIn="Hello World"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
