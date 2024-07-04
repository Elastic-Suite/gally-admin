import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import InputText from './InputText'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('InputTextError', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <InputText
        id="input-text"
        label="Label"
        placeholder="Name"
        color="primary"
        value="hello world"
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <InputText
        id="input-text"
        label="Label"
        placeholder="Name"
        required
        value=""
        showError
      />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should not display error without showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <InputText
        id="input-text"
        label="Label"
        placeholder="Name"
        required
        value=""
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('should not display error with showError prop when the field is required and disabled with missing value', () => {
    renderWithProviders(
      <InputText
        id="input-text"
        label="Label"
        placeholder="Name"
        required
        value=""
        showError
        disabled
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shoud display error with showError prop when the field has additional validation rules', () => {
    renderWithProviders(
      <InputText
        id="input-text"
        label="Label"
        placeholder="Name"
        value=""
        required
        showError
        additionalValidator={(): string => {
          return 'erreur'
        }}
      />
    )
    expect(screen.getByText('formError.erreur')).toBeInTheDocument()
  })

  it('should display a replacement error message with replacementErrorsMessages prop when the field has an error', () => {
    renderWithProviders(
      <InputText
        id="input-text"
        label="Label"
        placeholder="Name"
        required
        value=""
        showError
        replacementErrorsMessages={{
          valueMissing: 'customError',
        }}
      />
    )
    expect(screen.getByText('formError.customError')).toBeInTheDocument()
  })
})
