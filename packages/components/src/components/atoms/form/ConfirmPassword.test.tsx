import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import ConfirmPassword from './ConfirmPassword'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('ConfirmPassword', () => {
  it('should display initial state', () => {
    const { container } = renderWithProviders(<ConfirmPassword value={null} />)
    expect(container).toMatchSnapshot()
  })

  it('should display with different labels', () => {
    const { container } = renderWithProviders(
      <ConfirmPassword
        value={null}
        passwordLabel="Other password label"
        confirmPasswordLabel="Other confirm password label"
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should not display error with showError prop when the password are the same', () => {
    const { container } = renderWithProviders(
      <ConfirmPassword
        value={{ password: 'aPassword', confirmPassword: 'aPassword' }}
        showError
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the fields are required with missing values', () => {
    renderWithProviders(
      <ConfirmPassword
        value={{ password: '', confirmPassword: '' }}
        showError
      />
    )
    expect(screen.getAllByText('formError.valueMissing')).toHaveLength(2)
  })

  it('should display error with showError prop when the password are not the same', () => {
    renderWithProviders(
      <ConfirmPassword
        value={{ password: 'aPassword', confirmPassword: 'aConfirmPassword' }}
        showError
      />
    )
    expect(screen.getByText('formError.mismatchPassword')).toBeInTheDocument()
  })
})
