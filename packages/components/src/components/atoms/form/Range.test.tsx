import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import Range from './Range'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('Range', () => {
  it('sould match snapshot', () => {
    const { container } = renderWithProviders(
      <Range label="Label" value={[1, 3]} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <Range label="Label" required showError value={[1, null]} />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should not display error without showError prop when the field is required with missing value', () => {
    renderWithProviders(<Range label="Label" required value={[null, null]} />)
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('should not display error with showError prop when the field is required and disabled with missing value', () => {
    renderWithProviders(
      <Range label="Label" required showError disabled value={[null, 1]} />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shoud display error with showError prop when the field has additional validation rules', () => {
    renderWithProviders(
      <Range
        label="Label"
        showError
        required
        value={[1, null]}
        additionalValidator={(): string => 'erreur'}
      />
    )
    expect(screen.getByText('formError.erreur')).toBeInTheDocument()
  })

  it('should display a replacement error message with replacementErrorsMessages prop when the field has an error', () => {
    renderWithProviders(
      <Range
        label="Label"
        showError
        required
        value={[1, null]}
        additionalValidator={(): string => 'erreur'}
        replacementErrorsMessages={{
          erreur: 'customError',
        }}
      />
    )
    expect(screen.getByText('formError.customError')).toBeInTheDocument()
  })
})
