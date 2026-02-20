import React from 'react'
import KPI, { IKPIProps } from '../../atoms/KPI/KPI'
import { Container } from './KPIGroup.styled'
import { TestId, generateTestId } from '../../../utils/testIds'

interface IKPI extends IKPIProps {
  id: string | number
}

interface IKPIGroupProps {
  kpis: IKPI[]
  animated?: boolean
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
