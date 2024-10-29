import React, { CSSProperties } from 'react'
import { styled } from '@mui/system'

export interface IKPIPros {
  label: string
  value: number
  isPercentage: boolean
}

const comonStyle: CSSProperties = {
  textAlign: 'center',
  margin: 0,
  fontFamily: 'var(--gally-font)',
}

const Title = styled('h3')(({ theme }) => ({
  ...comonStyle,
  fontSize: theme.spacing(2),
  fontWeight: 400,
  color: theme.palette.colors.neutral[600],
  textTransform: 'capitalize',
  whiteSpace: 'normal',
}))

const Content = styled('p')(({ theme }) => ({
  ...comonStyle,
  fontSize: theme.spacing(6),
  fontWeight: 700,
  color: theme.palette.colors.primary.main,
}))

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  width: 232,
}))

function KPI({ label, value, isPercentage = false }: IKPIPros): JSX.Element {
  return (
    <Container>
      <Title>{label}</Title>
      <Content>
        {`${value.toLocaleString('fr-FR')}${isPercentage ? '%' : ''}`}
      </Content>
    </Container>
  )
}

export default KPI
