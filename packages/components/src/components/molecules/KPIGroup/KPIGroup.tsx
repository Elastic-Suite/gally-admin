import React from 'react'
import KPI, { IKPIProps } from '../../atoms/KPI/KPI'
import { Container } from './KPIGroup.styled'

interface IKPI extends IKPIProps {
  id: string | number
}

interface IKPIGroupProps {
  kpis: IKPI[]
  animated?: boolean
}

function KPIGroup({ kpis, animated = false }: IKPIGroupProps): JSX.Element {
  return (
    <Container>
      {kpis.map(({ id, ...value }) => (
        <KPI key={id} {...value} animated={animated} />
      ))}
    </Container>
  )
}

export default KPIGroup
