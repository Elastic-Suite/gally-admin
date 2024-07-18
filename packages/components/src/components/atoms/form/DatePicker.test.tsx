import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import DatePicker from './DatePicker'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('DatePicker', () => {
  it('sould match snapshot', () => {
    const { container } = renderWithProviders(
      <DatePicker
        label="Label"
        value={new Date('Fri, 12 Apr 2024 12:40:52 GMT')}
        onChange={(): void => {
          // Do Something
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <DatePicker
        label="Label"
        required
        showError
        value={null}
        onChange={(): void => {
          // Do Something
        }}
      />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should display error with showError prop when the field have an invalid value', () => {
    renderWithProviders(
      <DatePicker
        label="Label"
        required
        showError
        value="invalid value"
        onChange={(): void => {
          // Do Something
        }}
      />
    )
    expect(screen.getByText('formError.invalidDate')).toBeInTheDocument()
  })

  it('should not display error without showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <DatePicker
        label="Label"
        required
        value={null}
        onChange={(): void => {
          // Do Something
        }}
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('should not display error with showError prop when the field is required and disabled with missing value', () => {
    renderWithProviders(
      <DatePicker
        label="Label"
        required
        showError
        disabled
        value={null}
        onChange={(): void => {
          // Do Something
        }}
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shoud display error with showError prop when the field has additional validation rules', () => {
    renderWithProviders(
      <DatePicker
        label="Label"
        showError
        required
        value={null}
        onChange={(): void => {
          // Do Something
        }}
        additionalValidator={(): string => {
          return 'erreur'
        }}
      />
    )
    expect(screen.getByText('formError.erreur')).toBeInTheDocument()
  })
})
