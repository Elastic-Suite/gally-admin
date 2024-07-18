import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import TextareaWithoutError from './TextareaWithoutError'

describe('TextareaWithoutError match snapshot', () => {
  it('TextareaWithoutErrorAllFalse', () => {
    const { container } = renderWithProviders(
      <TextareaWithoutError
        id="textarea"
        label="Label"
        placeholder="Describe your issue"
        required={false}
        disabled={false}
        maxLength={250}
        error={false}
        resizable={false}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('TextareaWithoutErrorAllTrue', () => {
    const { container } = renderWithProviders(
      <TextareaWithoutError
        id="textarea"
        label="Label"
        placeholder="Describe your issue"
        required
        disabled
        maxLength={250}
        error
        resizable
      />
    )
    expect(container).toMatchSnapshot()
  })
})
