import React, { ReactNode } from 'react'
import { tabVisibilityContext } from '../../../contexts'

interface IProps {
  children: ReactNode
  value: boolean
}

function TabVisibilityProvider(props: IProps): JSX.Element {
  const { children, value } = props
  return (
    <tabVisibilityContext.Provider value={value}>
      {children}
    </tabVisibilityContext.Provider>
  )
}

export default TabVisibilityProvider
