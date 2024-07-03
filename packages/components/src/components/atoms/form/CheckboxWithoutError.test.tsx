import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import CheckboxWithoutError from './CheckboxWithoutError'

describe('Checkbox match snapshot', () => {
  it('CheckboxIndeterminateFalse', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate={false} />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxIndeterminateTrue', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxLabelAndList', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate label="Label" list />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxLabel', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate={false} label="Label" />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxListTrue', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate={false} list />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxListFalse', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate={false} list={false} />
    )
    expect(container).toMatchSnapshot()
  })
})
