import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import ConfirmPassword from './ConfirmPassword'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('DoubleDatePicker', () => {
  it('should display initial state', () => {
    const { container } = renderWithProviders(
      <ConfirmPassword
        value={ null }
        dataTestId="prefix"
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display with different labels', () => {
    const { container } = renderWithProviders(
      <ConfirmPassword
        value={ null }
        passwordLabel="Other password label"
        confirmPasswordLabel="Other confirm password label"
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should not display error with showError prop when the password are the same', () => {
    const { container } = renderWithProviders(
      <ConfirmPassword
        value={ {password:'aPassword', confirmPassword:'aPassword'}}
        showError
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the fields are required with missing values', () => {
    renderWithProviders(
      <ConfirmPassword
        value={ null }
        showError
      />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should display error with showError prop when the password are not the same', () => {
    renderWithProviders(
      <ConfirmPassword
        value={ {password:'aPassword', confirmPassword:'aConfirmPassword'}}
        showError
      />
    )
    expect(screen.getByText('formError.mismatchPassword')).toBeInTheDocument()
  })

  it('should display error with showError prop when the first date is superior to the second date', () => {
    renderWithProviders(
      <ConfirmPassword
        value={ {password:'toto', confirmPassword:'toto'}}
        passwordLabel="Other password label"
        confirmPasswordLabel="Other confirm password label"
        dataTestId="prefix"
      />
    )
    expect(
      screen.getByText('formError.doubleDatePickerRange')
    ).toBeInTheDocument()
  })

})
