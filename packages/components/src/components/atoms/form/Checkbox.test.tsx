import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import Checkbox from './Checkbox'
import { screen } from '@testing-library/react'

describe('Checkbox', () => {
  it('sould match snapshot', () => {
    const { container } = renderWithProviders(<Checkbox label="Label" value />)
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the field is required with missing value', () => {
    renderWithProviders(<Checkbox label="Label" required showError />)
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should not display error without showError prop when the field is required with missing value', () => {
    renderWithProviders(<Checkbox label="Label" required />)
    expect(screen.queryByText('formError.erreur')).not.toBeInTheDocument()
  })

  it('should not display error with showError prop when the field is required and disabled with missing value', () => {
    renderWithProviders(<Checkbox label="Label" required showError disabled />)
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shoud display error with showError prop when the field has additional validation rules', () => {
    renderWithProviders(
      <Checkbox
        label="Label"
        showError
        required
        additionalValidator={(): string => {
          return 'erreur'
        }}
      />
    )
    expect(screen.getByText('formError.erreur')).toBeInTheDocument()
  })
})
