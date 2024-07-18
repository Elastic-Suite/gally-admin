import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import InputTextWithoutError from './InputTextWithoutError'

describe('InputTextWithoutError match snapshot', () => {
  it('BadgeDisabledFalse', () => {
    const { container } = renderWithProviders(
      <InputTextWithoutError
        id="input-text"
        label="Label"
        placeholder="Name"
        required={false}
        disabled={false}
        helperText=""
        helperIcon=""
        color="primary"
        endAdornment={null}
        value="hello world"
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('BadgeDisabledFalseRequired', () => {
    const { container } = renderWithProviders(
      <InputTextWithoutError
        id="input-text"
        label="Label"
        placeholder="Name"
        required
        disabled
        helperText=""
        helperIcon=""
        color="primary"
        endAdornment={null}
        value="hello world"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
