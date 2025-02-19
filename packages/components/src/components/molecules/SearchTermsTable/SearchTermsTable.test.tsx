import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import SearchTermsTable from './SearchTermsTable'

describe('SearchTermsTable', () => {
  it('SearchTermsTable match snapshot', () => {
    const { container } = renderWithProviders(
      <SearchTermsTable
        data={[
          { term: 'Test 1', session: 1 },
          { term: 'Test 2', session: 2 },
          { term: 'Test 3', session: 3 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
