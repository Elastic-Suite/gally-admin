import React from 'react'
import KPI, { IKPIPros } from '../../atoms/KPI/KPI'
import { Container } from './KPIGroup.styled'

interface IKPI extends IKPIPros {
  id: string | number
}

interface IKPIGroupProps {
  kpis: IKPI[]
}

function KPIGroup({ kpis }: IKPIGroupProps): JSX.Element {
  return (
    <Container>
      {kpis.map(({ id, ...value }) => (
        <KPI key={id} {...value} />
      ))}
    </Container>
  )
}

export default KPIGroup
