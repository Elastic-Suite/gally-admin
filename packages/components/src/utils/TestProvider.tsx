import React, { ReactNode } from 'react'

import catalogs from '../../public/mocks/catalog.json'

import CatalogProvider from '../components/stateful-providers/CatalogProvider/CatalogProvider'

import OptionsProvider from '../components/stateful-providers/OptionsProvider/OptionsProvider'

interface IProps {
  children: ReactNode
}

function TestProvider(props: IProps): JSX.Element {
  const { children } = props
  return (
    <OptionsProvider>
      <CatalogProvider
        catalogId={-1}
        catalogs={catalogs['hydra:member']}
        localizedCatalogId={-1}
      >
        {children}
      </CatalogProvider>
    </OptionsProvider>
  )
}

export default TestProvider
