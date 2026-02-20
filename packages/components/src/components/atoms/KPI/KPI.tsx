import React from 'react'
import { Container, Content, Title } from './KPI.styled'
import { styled } from '@mui/system'
import { useAnimatedValue } from '../../../hooks/useAnimatedValue'
import { TestId, generateTestId } from '../../../utils/testIds'

export interface IKPIProps {
  label: string
  value: number
  isPercentage?: boolean
  animated?: boolean
  componentId?: string
}

const StyledTitle = styled(Title)({
  textTransform: 'none',
})

function KPI({
  label,
  value,
  isPercentage,
  animated,
  componentId,
}: IKPIProps): JSX.Element {
  const animatedValue = useAnimatedValue(value, { enabled: animated })
  return (
    <Container data-testid={generateTestId(TestId.KPI, componentId)}>
      <StyledTitle>{label}</StyledTitle>
      <Content>{`${animatedValue.toLocaleString()}${
        isPercentage ? '%' : ''
      }`}</Content>
    </Container>
  )
}

export default KPI
