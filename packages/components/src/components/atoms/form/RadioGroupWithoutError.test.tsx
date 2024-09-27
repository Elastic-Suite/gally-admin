import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import RadioGroupWithoutError from './RadioGroupWithoutError'

describe('RadioGroupWithoutError match snapshot', () => {
  it('Radio group defaultChecked true with default', () => {
    const { container } = renderWithProviders(
      <RadioGroupWithoutError
        name="radio-buttons-group"
        defaultChecked
        row
        options={[
          { value: 'male', label: 'Label One', disabled: true },
          { value: 'female', label: 'Label Two', default: true },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('RadioGroupWithoutError defaultChecked true without default', () => {
    const { container } = renderWithProviders(
      <RadioGroupWithoutError
        name="radio-buttons-group"
        defaultChecked
        row
        options={[
          { value: 'male', label: 'Label One', disabled: true },
          { value: 'female', label: 'Label Two' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('RadioGroupWithoutError defaultChecked False with default true', () => {
    const { container } = renderWithProviders(
      <RadioGroupWithoutError
        name="radio-buttons-group"
        defaultChecked={false}
        row
        options={[
          { value: 'male', label: 'Label One', disabled: true },
          { value: 'female', label: 'Label Two', default: true },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('RadioGroupWithoutError defaultChecked False without default', () => {
    const { container } = renderWithProviders(
      <RadioGroupWithoutError
        name="radio-buttons-group"
        defaultChecked={false}
        row
        options={[
          { value: 'male', label: 'Label One', disabled: true },
          { value: 'female', label: 'Label Two' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
