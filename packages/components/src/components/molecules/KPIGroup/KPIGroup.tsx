import React from 'react'
import KPI, { IKPIPros } from '../../atoms/KPI/KPI'
import { styled } from '@mui/system'

interface IKPI extends IKPIPros {
  id: string | number
}

interface IKPIGroupProps {
  kpis: IKPI[]
}

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: theme.spacing(8),
  rowGap: theme.spacing(14),
  width: '100%',
}))

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
