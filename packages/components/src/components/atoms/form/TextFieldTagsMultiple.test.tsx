import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import TextFieldTagsMultiple from './TextFieldTagsMultiple'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {
  IOptionsTags,
  ISearchLimitations,
} from '@elastic-suite/gally-admin-shared'

const textOperatorOptions: IOptionsTags[] = [
  {
    id: 'eq',
    value: 'eq',
    label: 'is',
  },
  {
    id: '%like',
    value: '%like',
    label: 'starts with',
  },
  {
    id: '%like%',
    value: '%like%',
    label: 'contains',
  },
  {
    id: 'like%',
    value: 'like%',
    label: 'ends with',
  },
]

const searchLimitations: ISearchLimitations[] = [
  {
    '@id': '/boost_search_limitations/1',
    '@type': 'BoostSearchLimitation',
    operator: 'eq',
    queryText: 'salut',
  },
  {
    '@id': '/boost_search_limitations/1',
    '@type': 'BoostSearchLimitation',
    operator: 'eq',
    queryText: 'eq again',
  },
  {
    '@id': '/boost_search_limitations/1',
    '@type': 'BoostSearchLimitation',
    operator: '%like',
    queryText: 'TEST123',
  },
  {
    '@id': '/boost_search_limitations/1',
    '@type': 'BoostSearchLimitation',
    operator: '%like%',
    queryText: 'Hello',
  },
]

describe('TextFieldTagsMultiple', () => {
  it('sould match snapshot', () => {
    const { container } = renderWithProviders(
      <TextFieldTagsMultiple
        label="Label"
        options={textOperatorOptions}
        value={searchLimitations}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should display error with showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <TextFieldTagsMultiple
        options={textOperatorOptions}
        label="Label"
        required
        value={[
          {
            operator: 'eq',
            queryText: null,
          },
        ]}
        showError
      />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('should not display error without showError prop when the field is required with missing value', () => {
    renderWithProviders(
      <TextFieldTagsMultiple
        options={textOperatorOptions}
        label="Label"
        required
        value={[
          {
            operator: 'eq',
            queryText: null,
          },
        ]}
      />
    )
    expect(screen.queryByText('formError.erreur')).not.toBeInTheDocument()
  })

  it('should not display error with showError prop when the field is required and disabled with missing value', () => {
    renderWithProviders(
      <TextFieldTagsMultiple
        label="Label"
        required
        disabled
        options={textOperatorOptions}
        value={[
          {
            operator: 'eq',
            queryText: null,
          },
        ]}
        showError
      />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })
})
