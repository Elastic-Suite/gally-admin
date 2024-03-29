import React from 'react'
import { useTranslation } from 'next-i18next'

import Chip from '../Chip/Chip'
import { getStockStatusLabel } from '@elastic-suite/gally-admin-shared'

interface IProps {
  stockStatus: boolean
}

function Stock(props: IProps): JSX.Element {
  const { stockStatus } = props
  const { t } = useTranslation('common')
  const label = t(getStockStatusLabel(stockStatus))

  return <Chip color={stockStatus ? 'success' : 'error'} label={label} />
}

export default Stock
