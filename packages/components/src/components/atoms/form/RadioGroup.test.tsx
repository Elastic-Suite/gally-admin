import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import RadioGroup from './RadioGroup'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

const options = [
  {
    label: 'Test 1',
    value: 1,
  },
  {
    label: 'Test 2',
    value: 2,
  },
  {
    label: 'Test 3',
    value: 3,
  },
]

describe('RadioGroup', () => {
  it('sould match snapshot', () => {
    const { container } = renderWithProviders(
      <RadioGroup options={options} value={1} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the field is required with missing value', () => {
    renderWithProviders(<RadioGroup options={options} required showError />)
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should not display error without showError prop when the field is required with missing value', () => {
    renderWithProviders(<RadioGroup options={options} required />)
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shoud display error with showError prop when the field has additional validation rules', () => {
    renderWithProviders(
      <RadioGroup
        options={options}
        required
        showError
        additionalValidator={(): string => 'erreur'}
      />
    )
    expect(screen.getByText('formError.erreur')).toBeInTheDocument()
  })
})
