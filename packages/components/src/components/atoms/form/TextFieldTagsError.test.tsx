import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import TextFieldTagsError from './TextFieldTagsError'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('TextFieldTagsError', () => {
  it('sould match snapshot', () => {
    const { container } = renderWithProviders(
      <TextFieldTagsError label="Label" value={['test']} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <TextFieldTagsError label="Label" required value={[]} showError />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should not display error without showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <TextFieldTagsError label="Label" required value={[]} />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('should not display error with showError prop when the field is required and disabled with missing value', () => {
    renderWithProviders(
      <TextFieldTagsError
        label="Label"
        required
        disabled
        value={[]}
        showError
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shoud display error with showError prop when the field has additional validation rules', () => {
    renderWithProviders(
      <TextFieldTagsError
        label="Label"
        required
        value={['test']}
        showError
        additionalValidator={(): string => {
          return 'erreur'
        }}
      />
    )
    expect(screen.getByText('formError.erreur')).toBeInTheDocument()
  })
})
