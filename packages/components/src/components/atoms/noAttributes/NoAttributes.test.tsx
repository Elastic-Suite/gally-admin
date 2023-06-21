import React from 'react'

import { renderWithProviders } from '../../../utils/tests'

import NoAttributes from './NoAttributes'

describe('NoAttributes', () => {
  it('NoAttributes with absolutLink', () => {
    const { container } = renderWithProviders(
      <NoAttributes
        title="No attributes were specified as searchable in the settings"
        btnTitle="Add searchable attributes"
        btnHref="admin/settings/attributes"
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('NoAttributes without absolutLink', () => {
    const { container } = renderWithProviders(
      <NoAttributes
        title="No attributes were specified as searchable in the settings"
        btnTitle="Add searchable attributes"
        btnHref="admin/settings/attributes"
        absolutLink={false}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
