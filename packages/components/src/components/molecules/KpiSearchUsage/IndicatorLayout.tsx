import React from 'react'

import { indicatorInstanceContext } from '../../../contexts'
import { TestId, generateTestId, joinItemIds } from '../../../utils/testIds'

import ConversionRateChart from './ConversionRateChart'
import {
  IndicatorSize,
  StyledIndicatorCard,
  StyledIndicatorCell,
  StyledIndicatorGrid,
} from './KpiSearchUsage.styled'
import PopularSearchTermsTable from './PopularSearchTermsTable'
import SessionsChart from './SessionsChart'
import ZeroResultTable from './ZeroResultTable'

interface IIndicatorLeaf {
  id: string
  size: IndicatorSize
  Indicator: () => JSX.Element
}

interface IIndicatorGroup {
  id: string
  size: IndicatorSize
  children: IIndicatorNode[]
  cards?: boolean
}

type IIndicatorNode = IIndicatorLeaf | IIndicatorGroup

export const indicatorLayout: IIndicatorNode[] = [
  {
    id: 'popularSearchTerms',
    size: 'full',
    Indicator: PopularSearchTermsTable,
  },
  { id: 'zeroResult', size: 'half', Indicator: ZeroResultTable },
  {
    id: 'charts',
    size: 'half',
    cards: true,
    children: [
      { id: 'sessions', size: 'full', Indicator: SessionsChart },
      { id: 'conversionRate', size: 'full', Indicator: ConversionRateChart },
    ],
  },
]

interface IIndicatorNodeContentProps {
  node: IIndicatorNode
  path: string
}

function IndicatorNodeContent({
  node,
  path,
}: IIndicatorNodeContentProps): JSX.Element {
  if (!('children' in node)) {
    return (
      <indicatorInstanceContext.Provider value={path}>
        <node.Indicator />
      </indicatorInstanceContext.Provider>
    )
  }
  return (
    <StyledIndicatorGrid level="inCard">
      {node.children.map((child) => {
        const childPath = joinItemIds(path, child.id)
        return (
          <StyledIndicatorCell
            key={child.id}
            size={child.size}
            data-testid={generateTestId(TestId.KPI_LAYOUT_CELL, childPath)}
          >
            <IndicatorNodeContent node={child} path={childPath} />
          </StyledIndicatorCell>
        )
      })}
    </StyledIndicatorGrid>
  )
}

function IndicatorCard({
  node,
  path,
}: IIndicatorNodeContentProps): JSX.Element {
  if ('children' in node && node.cards) {
    return (
      <StyledIndicatorCell
        size={node.size}
        data-testid={generateTestId(TestId.KPI_LAYOUT_CELL, path)}
      >
        <StyledIndicatorGrid level="cards">
          {node.children.map((child) => (
            <IndicatorCard
              key={child.id}
              node={child}
              path={joinItemIds(path, child.id)}
            />
          ))}
        </StyledIndicatorGrid>
      </StyledIndicatorCell>
    )
  }
  return (
    <StyledIndicatorCard
      size={node.size}
      data-testid={generateTestId(TestId.KPI_LAYOUT_CARD, path)}
    >
      <IndicatorNodeContent node={node} path={path} />
    </StyledIndicatorCard>
  )
}

export default IndicatorCard
