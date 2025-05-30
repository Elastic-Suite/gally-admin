import React, { SyntheticEvent, useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'

import { ITab } from '@elastic-suite/gally-admin-shared'

import TabPanel from './TabPanel'
import { a11yProps } from './a11yProps'

interface IProps {
  defaultActiveId?: number
  onChange?: (id: number) => void
  tabs: ITab[]
}

export default function CustomTabs(props: IProps): JSX.Element {
  const { defaultActiveId, onChange, tabs } = props
  const [activeId, setActiveId] = useState(defaultActiveId ?? tabs[0]?.id)
  const activeTabExits = tabs.some((tab) => tab.id === activeId)
  if (!activeTabExits) {
    setActiveId(defaultActiveId ?? tabs[0]?.id)
  }

  const handleChange = (event: SyntheticEvent, id: number): void => {
    event.preventDefault()
    setActiveId(id)
    if (onChange) {
      onChange(id)
    }
  }

  return (
    <Box sx={{ width: '100%', marginTop: '-12px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeId}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabs.map(({ id, label }) => (
            <Tab key={id} label={label} {...a11yProps('simple-tabpanel', id)} />
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
