import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'

import { ITab } from '@elastic-suite/gally-admin-shared'

import TabPanel from './TabPanel'
import { a11yProps } from './a11yProps'
import { TestId, generateTestId } from '../../../../utils/testIds'

interface IProps {
  defaultActiveId?: number
  onChange?: (id: number) => void
  tabs: ITab[]
  componentId?: string
}

export default function CustomTabs(props: IProps): JSX.Element {
  const { defaultActiveId, onChange, tabs, componentId } = props
  const [activeId, setActiveId] = useState(defaultActiveId ?? tabs[0]?.id)
  const isInitialMount = useRef(true)
  const activeTabExits = tabs.some((tab) => tab.id === activeId)
  if (!activeTabExits) {
    setActiveId(defaultActiveId ?? tabs[0]?.id)
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (onChange) {
      onChange(activeId)
    }
  }, [activeId, onChange])

  const handleChange = (event: SyntheticEvent, id: number): void => {
    event.preventDefault()
    setActiveId(id)
  }

  return (
    <Box
      sx={{ width: '100%', marginTop: '-12px' }}
      data-testid={generateTestId(TestId.TABS, componentId)}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeId}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabs.map(({ id, label }) => (
            <Tab
              key={id}
              label={label}
              {...a11yProps('simple-tabpanel', id)}
              data-testid={generateTestId(TestId.TAB, componentId)}
            />
          ))}
        </Tabs>
      </Box>
      {tabs.map(({ id, Component, componentProps }) => (
        <TabPanel key={id} value={activeId} id={id}>
          <Component {...componentProps} active={id === activeId} />
        </TabPanel>
      ))}
    </Box>
  )
}
