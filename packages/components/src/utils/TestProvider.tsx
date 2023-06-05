import React, { ReactNode } from 'react'

import catalogs from '../../public/mocks/catalog.json'
import metadata from '../../public/mocks/metadata.json'

import { catalogContext, metadataContext } from '../contexts'
import { useCatalogs } from '../hooks'

import OptionsProvider from '../components/stateful-providers/OptionsProvider/OptionsProvider'

interface IProps {
  children: ReactNode
}

function TestProvider(props: IProps): JSX.Element {
  const { children } = props
  const contextValueCatalog = useCatalogs(catalogs['hydra:member'])
  const contextValueMetadata = metadata['hydra:member']

  return (
    <OptionsProvider>
      <catalogContext.Provider value={contextValueCatalog}>
        <metadataContext.Provider value={contextValueMetadata}>
          {children}
        </metadataContext.Provider>
      </catalogContext.Provider>
    </OptionsProvider>
  )
}

export default TestProvider
