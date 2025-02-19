import React from 'react'
import { Container, Content, Title } from './KPI.styled'

export interface IKPIPros {
  label: string
  value: number
  isPercentage?: boolean
}

function KPI({ label, value, isPercentage }: IKPIPros): JSX.Element {
  return (
    <Container>
      <Title>{label}</Title>
      <Content>{`${value.toLocaleString()}${isPercentage ? '%' : ''}`}</Content>
    </Container>
  )
}

export default KPI
