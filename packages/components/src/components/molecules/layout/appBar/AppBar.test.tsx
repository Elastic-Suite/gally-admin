import React from 'react'

import { renderWithProviders } from '../../../../utils/tests'

import menu from '../../../../../public/mocks/menu.json'

import AppBar from './AppBar'

describe('AppBar match snapshot', () => {
  it('AppBar simple', () => {
    const { container } = renderWithProviders(
      <AppBar slug={['search']} menu={menu} isConnected />
    )
    expect(container).toMatchSnapshot()
  })

  it('AppBarTwoSlug', () => {
    const { container } = renderWithProviders(
      <AppBar slug={['search', 'configuration']} menu={menu} isConnected />
    )
    expect(container).toMatchSnapshot()
  })

  it('AppBarThreeSlug', () => {
    const { container } = renderWithProviders(
      <AppBar
        slug={['search', 'configuration', 'autocompletion']}
        menu={menu}
        isConnected
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('AppBarThreeSlug not connected', () => {
    const { container } = renderWithProviders(
      <AppBar
        slug={['search', 'configuration', 'autocompletion']}
        menu={menu}
        isConnected={false}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
