import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { TabVisibilityContext } from '../../../contexts/TabVisibilityContext'

interface IProps {
  children?: ReactNode
  id: number
  value: number
}

function SubTabPanel(props: IProps): JSX.Element {
  const { children, id, value } = props
  const [isLoaded, setIsLoaded] = useState(false)

  // Get parent's visibility from context
  const isParentVisible = useContext(TabVisibilityContext)
  // This subtab's own visibility state
  const isOwnVisible = value === id
  // Combined visibility: visible only if parent is visible and this subtab is active
  const isVisible = isParentVisible && isOwnVisible

  useEffect(() => {
    if (value === id) {
      setIsLoaded(true)
    }
  }, [value, id])

  return (
    <TabVisibilityContext.Provider value={isVisible}>
      <div
        style={{ width: '100%', display: id === value ? 'block' : 'none' }}
        key={id}
      >
        {(value === id || Boolean(isLoaded)) && children}
      </div>
    </TabVisibilityContext.Provider>
  )
}

export default SubTabPanel
