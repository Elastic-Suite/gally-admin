import React, { ReactNode } from 'react'

import { kpiFiltersContext } from '../../../contexts'
import { useKpiFilters } from '../../../hooks'

interface IProps {
  children: ReactNode
}

function KpiFiltersProvider(props: IProps): JSX.Element {
  const { children } = props
  const contextValue = useKpiFilters()

  return (
    <kpiFiltersContext.Provider value={contextValue}>
      {children}
    </kpiFiltersContext.Provider>
  )
}

export default KpiFiltersProvider
