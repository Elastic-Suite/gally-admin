import React from 'react'
import { TFunction } from 'next-i18next'
import KPI, { IKPIProps } from '../../atoms/KPI/KPI'
import { Container } from './KPIGroup.styled'
import { TestId, generateTestId } from '../../../utils/testIds'
import type { IKPI } from '../KpiLoader/KpiLoader'

export interface IKPIGroupItem extends IKPIProps {
  id: string | number
}

interface IKPIGroupProps {
  kpis: IKPIGroupItem[]
  animated?: boolean
}

const excludedKeys = [
  '@id',
  '@type',
  'id',
  'localizedCatalog',
  'startDate',
  'endDate',
  'valueFormat',
]

export function getKpiGroupItems(kpi: IKPI, t: TFunction): IKPIGroupItem[] {
  return Object.entries(kpi)
    .filter(([label, _]) => !excludedKeys.includes(label))
    .map(([label, value], index) => ({
      id: `${kpi.id}_${index}`,
      componentId: label,
      label: t(label),
      value: value ?? '',
      isPercentage: kpi?.valueFormat?.[label] === 'percentage',
    }))
}

function KPIGroup({ kpis, animated = false }: IKPIGroupProps): JSX.Element {
  return (
    <Container data-testid={generateTestId(TestId.KPI_GROUP)}>
      {kpis.map(({ id, ...value }) => (
        <KPI key={id} {...value} animated={animated} />
      ))}
    </Container>
  )
}

export default KPIGroup
