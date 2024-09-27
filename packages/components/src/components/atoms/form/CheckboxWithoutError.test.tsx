import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import CheckboxWithoutError from './CheckboxWithoutError'

describe('CheckboxWithoutError match snapshot', () => {
  it('CheckboxWithoutErrorIndeterminateFalse', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate={false} />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxWithoutErrorIndeterminateTrue', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxWithoutErrorLabelAndList', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate label="Label" list />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxWithoutErrorLabel', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate={false} label="Label" />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxWithoutErrorListTrue', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate={false} list />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxWithoutErrorListFalse', () => {
    const { container } = renderWithProviders(
      <CheckboxWithoutError indeterminate={false} list={false} />
    )
    expect(container).toMatchSnapshot()
  })
})
