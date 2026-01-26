import React from 'react'
import { renderWithProviders } from '../../../utils/tests'
import ScopeSearchUsage from './ScopeSearchUsage'
import catalogMock from '../../../../public/mocks/catalog.json'

describe('ScopeSearchUsage', () => {
  it('match snapshot', () => {
    const catalogsOptions = catalogMock.member.flatMap((catalog) => {
      return catalog.localizedCatalogs.map((localizedCatalog) => {
        return {
          id: catalog.name,
          value: localizedCatalog['@id'],
          label: localizedCatalog.name,
        }
      })
    })

    const { container } = renderWithProviders(
      <ScopeSearchUsage catalogsOptions={catalogsOptions} />
    )

    expect(container).toMatchSnapshot()
  })
})
