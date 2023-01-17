import React, { ReactNode } from 'react'

import catalogs from '../../public/mocks/catalog.json'

import { catalogContext } from '../contexts'
import { useCatalogs } from '../hooks'

import OptionsProvider from '../components/stateful-providers/OptionsProvider/OptionsProvider'

interface IProps {
  children: ReactNode
}

function TestProvider(props: IProps): JSX.Element {
  const { children } = props
  const contextValue = useCatalogs(catalogs['hydra:member'])

  return (
    <OptionsProvider>
      <catalogContext.Provider value={contextValue}>
        {children}
      </catalogContext.Provider>
    </OptionsProvider>
  )
}

export default TestProvider
