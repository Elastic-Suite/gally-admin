import React, { ReactNode, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { TabVisibilityContext } from '../../../../contexts/TabVisibilityContext'

interface IProps {
  children?: ReactNode
  id: number
  value: number
}

function TabPanel(props: IProps): JSX.Element {
  const { children, value, id, ...other } = props
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (value === id) {
      setIsLoaded(true)
    }
  }, [value, id])
  const isVisible = value === id

  return (
    <TabVisibilityContext.Provider value={isVisible}>
      <div
        role="tabpanel"
        hidden={value !== id}
        id={`simple-tabpanel-${id}`}
        aria-labelledby={`simple-tab-${id}`}
        {...other}
      >
        {isVisible || Boolean(isLoaded) ? (
          <Box
            sx={{
              paddingTop: 4,
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 500,
              fontFamily: 'var(--gally-font)',
            }}
          >
            {children}
          </Box>
        ) : null}
      </div>
    </TabVisibilityContext.Provider>
  )
}

export default TabPanel
