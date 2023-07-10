import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import Synonym from './Synonym'
import { ISynonyms } from '@elastic-suite/gally-admin-shared'
import { screen } from '@testing-library/react'

describe('Synonym match snapshot', () => {
  it('Synonym Full', () => {
    const synonyms: ISynonyms = [
      {
        '@id': '/thesaurus_synonyms/1',
        '@type': 'ThesaurusSynonym',
        terms: [
          {
            '@id': '/thesaurus_synonym_terms/1',
            '@type': 'ThesaurusSynonymTerm',
            term: 'pants',
          },
          {
            '@id': '/thesaurus_synonym_terms/2',
            '@type': 'ThesaurusSynonymTerm',
            term: 'trousers',
          },
        ],
      },
      {
        '@id': '/thesaurus_synonyms/3',
        '@type': 'ThesaurusSynonym',
        terms: [
          {
            '@id': '/thesaurus_synonym_terms/1',
            '@type': 'ThesaurusSynonymTerm',
            term: 'ankle socks',
          },
          {
            '@id': '/thesaurus_synonym_terms/2',
            '@type': 'ThesaurusSynonymTerm',
            term: 'socks',
          },
        ],
      },
    ]
    const { container } = renderWithProviders(
      <Synonym
        value={synonyms}
        required
        fullWidth={false}
        margin="normal"
        infoTooltip="Synonym value ..."
        placeholder="Add text"
        error
        helperText="helperText"
        helperIcon="close"
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('Synonym functional behavior', () => {
  it('Terms empty error', () => {
    renderWithProviders(<Synonym value={[{ terms: [] }]} />)
    expect(
      screen.getByText('synonym.error_message.terms.size.invalid').textContent
    ).toBe('synonym.error_message.terms.size.invalid')
  })
  it('Only one synonym error', () => {
    renderWithProviders(<Synonym value={[{ terms: [{ term: 'pants' }] }]} />)
    expect(
      screen.getByText('synonym.error_message.terms.size.invalid').textContent
    ).toBe('synonym.error_message.terms.size.invalid')
  })
  it('Synonym term empty error', () => {
    renderWithProviders(<Synonym value={[{ terms: [{ term: '' }] }]} />)
    expect(
      screen.getByText('synonym.error_message.terms.size.invalid').textContent
    ).toBe('synonym.error_message.terms.size.invalid')
  })
  it('Duplicate synonym error', () => {
    renderWithProviders(
      <Synonym value={[{ terms: [{ term: 'pants' }, { term: 'pants' }] }]} />
    )
    expect(
      screen.getByText('synonym.error_message.terms.duplicate').textContent
    ).toBe('synonym.error_message.terms.duplicate')
  })
})
