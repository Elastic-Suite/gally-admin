import React from 'react'
import { useTranslation } from 'next-i18next'

import Chip from '../Chip/Chip'
import { getStockStatusLabel } from '@elastic-suite/gally-admin-shared'
import { TestId, generateTestId } from '../../../utils/testIds'

interface IProps {
  stockStatus: boolean
  componentId?: string
}

function Stock(props: IProps): JSX.Element {
  const { stockStatus, componentId } = props
  const { t } = useTranslation('common')
  const label = t(getStockStatusLabel(stockStatus))

  return (
    <Chip
      color={stockStatus ? 'success' : 'error'}
      label={label}
      data-testid={generateTestId(TestId.STOCK, componentId)}
    />
  )
}

export default Stock
