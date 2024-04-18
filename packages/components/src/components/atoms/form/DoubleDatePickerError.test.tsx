import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import DoubleDatePickerError from './DoubleDatePickerError'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('RangeError', () => {
  it('sould match snapshot', () => {
    const { container } = renderWithProviders(
      <DoubleDatePickerError
        label="Label"
        value={{
          toDate: new Date('Fri, 12 Apr 2024 12:40:52 GMT'),
          fromDate: new Date('Fri, 12 Apr 2024 12:40:52 GMT'),
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <DoubleDatePickerError
        label="Label"
        required
        showError
        value={{ toDate: null, fromDate: null }}
      />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should display error with showError prop when the field have an invalid value', () => {
    renderWithProviders(
      <DoubleDatePickerError
        label="Label"
        required
        showError
        value={{ toDate: 'invalid value', fromDate: new Date() }}
      />
    )
    expect(screen.getByText('formError.invalidDate')).toBeInTheDocument()
  })

  it('should display error with showError prop when the first date is superior to the second date', () => {
    renderWithProviders(
      <DoubleDatePickerError
        label="Label"
        showError
        value={{ toDate: new Date(1680605116), fromDate: new Date() }}
      />
    )
    expect(
      screen.getByText('formError.doubleDatePickerRange')
    ).toBeInTheDocument()
  })

  it('should not display error without showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <DoubleDatePickerError
        label="Label"
        required
        value={{ toDate: null, fromDate: null }}
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('should not display error with showError prop when the field is required and disabled with missing value', () => {
    renderWithProviders(
      <DoubleDatePickerError
        label="Label"
        required
        showError
        disabled
        value={{ toDate: null, fromDate: null }}
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shoud display error with showError prop when the field has additional validation rules', () => {
    renderWithProviders(
      <DoubleDatePickerError
        label="Label"
        showError
        required
        value={{ toDate: null, fromDate: null }}
        additionalValidator={(): string => {
          return 'erreur'
        }}
      />
    )
    expect(screen.getByText('formError.erreur')).toBeInTheDocument()
  })
})
