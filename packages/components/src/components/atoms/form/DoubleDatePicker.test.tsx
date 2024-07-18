import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import DoubleDatePicker from './DoubleDatePicker'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('DoubleDatePicker', () => {
  it('sould match snapshot', () => {
    const { container } = renderWithProviders(
      <DoubleDatePicker
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
      <DoubleDatePicker
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
      <DoubleDatePicker
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
      <DoubleDatePicker
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
      <DoubleDatePicker
        label="Label"
        required
        value={{ toDate: null, fromDate: null }}
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('should not display error with showError prop when the field is required and disabled with missing value', () => {
    renderWithProviders(
      <DoubleDatePicker
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
      <DoubleDatePicker
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

  it('should display a replacement error message with replacementErrorsMessages prop when the field has an error', () => {
    renderWithProviders(
      <DoubleDatePicker
        label="Label"
        required
        showError
        value={{ toDate: null, fromDate: null }}
        replacementErrorsMessages={{
          valueMissing: 'customError',
        }}
      />
    )
    expect(screen.getByText('formError.customError')).toBeInTheDocument()
  })
})
