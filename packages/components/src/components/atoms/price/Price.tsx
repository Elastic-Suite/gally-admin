import React from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { formatPrice } from '@elastic-suite/gally-admin-shared'
import { TestId, generateTestId } from '../../../utils/testIds'

interface IProps {
  price: number
  currency: string
  countryCode: string
  componentId?: string
}

const PriceContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.colors.neutral['900'],
  fontFamily: 'var(--gally-font)',
  fontStyle: 'regular',
  fontSize: '14px',
  lineHeight: '20px',
  align: 'left',
  verticalAlign: 'center',
}))

function Price(props: IProps): JSX.Element {
  const { price, currency, countryCode, componentId } = props

  return (
    <PriceContainer data-testid={generateTestId(TestId.PRICE, componentId)}>
      {' '}
      {formatPrice(price, currency, countryCode)}
    </PriceContainer>
  )
}

export default Price
