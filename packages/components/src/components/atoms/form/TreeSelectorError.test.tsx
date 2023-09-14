import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import TreeSelectorError from './TreeSelectorError'
import { categories } from '../../../../public/mocks/categories.json'

import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('TreeSelectorError', () => {
  it('sould match snapshot', () => {
    const { container } = renderWithProviders(
      <TreeSelectorError
        label="Label"
        data={categories}
        value={{
          id: 'two',
          name: 'Catégorie Deux',
          level: 1,
          path: 'two',
          isVirtual: false,
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('sould match snapshot width multiple value', () => {
    const { container } = renderWithProviders(
      <TreeSelectorError
        label="Label"
        multiple
        data={categories}
        value={[
          {
            id: 'two',
            name: 'Catégorie Deux',
            level: 1,
            path: 'two',
            isVirtual: false,
          },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <TreeSelectorError
        label="Label"
        data={categories}
        required
        showError
        multiple
        value={[]}
      />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should not display error without showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <TreeSelectorError
        label="Label"
        multiple
        data={categories}
        value={[]}
        required
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('should not display error with showError prop when the field is required and disabled with missing value', () => {
    renderWithProviders(
      <TreeSelectorError
        label="Label"
        data={categories}
        value={[]}
        multiple
        required
        showError
        disabled
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shoud display error with showError prop when the field has additional validation rules', () => {
    renderWithProviders(
      <TreeSelectorError
        label="Label"
        data={categories}
        value={[]}
        multiple
        required
        showError
        additionalValidator={(): string => 'erreur'}
      />
    )
    expect(screen.getByText('formError.erreur')).toBeInTheDocument()
  })
})
