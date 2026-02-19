import React from 'react'
import { Container, Content, Title } from './KPI.styled'
import { styled } from '@mui/system'
import { useAnimatedValue } from '../../../hooks/useAnimatedValue'

export interface IKPIProps {
  label: string
  value: number
  isPercentage?: boolean
  animated?: boolean
}

const StyledTitle = styled(Title)({
  textTransform: 'none',
})

function KPI({ label, value, isPercentage, animated }: IKPIProps): JSX.Element {
  const animatedValue = useAnimatedValue(value, { enabled: animated })
  return (
    <Container>
      <StyledTitle>{label}</StyledTitle>
      <Content>{`${animatedValue.toLocaleString()}${
        isPercentage ? '%' : ''
      }`}</Content>
    </Container>
  )
}

export default KPI
