import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import Expansion from './Expansion'
import { IExpansions } from '@elastic-suite/gally-admin-shared'
import { screen } from '@testing-library/react'

describe('Expansion match snapshot', () => {
  it('Expansion Full', () => {
    const expansions: IExpansions = [
      {
        '@id': '/thesaurus_expansions/1',
        '@type': 'ThesaurusExpansion',
        referenceTerm: 'top',
        terms: [
          {
            '@id': '/thesaurus_expansion_terms/1',
            '@type': 'ThesaurusSExpansionTerm',
            term: 'pants',
          },
          {
            '@id': '/thesaurus_expansion_terms/2',
            '@type': 'ThesaurusSExpansionTerm',
            term: 'trousers',
          },
        ],
      },
      {
        '@id': '/thesaurus_expansions/3',
        '@type': 'ThesaurusExpansion',
        referenceTerm: 'bottom',
        terms: [
          {
            '@id': '/thesaurus_expansion_terms/1',
            '@type': 'ThesaurusSExpansionTerm',
            term: 'ankle socks',
          },
          {
            '@id': '/thesaurus_expansion_terms/2',
            '@type': 'ThesaurusSExpansionTerm',
            term: 'socks',
          },
        ],
      },
    ]
    const { container } = renderWithProviders(
      <Expansion
        value={expansions}
        required
        fullWidth={false}
        margin="normal"
        infoTooltip="Expansion value ..."
        placeholder="Add text"
        error
        helperText="helperText"
        helperIcon="close"
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('Expansion functional behavior', () => {
  it('Reference term empty error', () => {
    renderWithProviders(
      <Expansion
        value={[{ referenceTerm: '', terms: [{ term: 'pants' }] }]}
        showError
      />
    )
    expect(screen.getByText('formError.valueMissing').textContent).toBe(
      'formError.valueMissing'
    )
  })
  it('Expansion terms empty error', () => {
    renderWithProviders(
      <Expansion value={[{ referenceTerm: 'top', terms: [] }]} showError />
    )
    expect(screen.getByText('formError.valueMissing').textContent).toBe(
      'formError.valueMissing'
    )
  })
  it('Expansion terms term empty error', () => {
    renderWithProviders(
      <Expansion value={[{ referenceTerm: 'top', terms: [] }]} showError />
    )
    expect(screen.getByText('formError.valueMissing').textContent).toBe(
      'formError.valueMissing'
    )
  })
  it('Expansion terms duplicate error', () => {
    renderWithProviders(
      <Expansion
        value={[
          {
            referenceTerm: 'top',
            terms: [{ term: 'pants' }, { term: 'pants' }],
          },
        ]}
        showError
      />
    )
    expect(
      screen.getByText('formError.expansionTermsDuplicate').textContent
    ).toBe('formError.expansionTermsDuplicate')
  })
})
