import React from 'react'
import { useTranslation } from 'next-i18next'

import ReadOnlyTable from '../../atoms/ReadOnlyTable/ReadOnlyTable'
import { IRow } from '../../atoms/ReadOnlyTable/ReadOnlyTable.styled'
import { IKpiTermItem } from '../KpiLoader/KpiLoader'

interface ITermsGridProps<T extends IKpiTermItem> {
  componentId: string
  rows: T[]
  columns: (keyof T & string)[]
}

function TermsGrid<T extends IKpiTermItem>({
  componentId,
  rows,
  columns,
}: ITermsGridProps<T>): JSX.Element {
  const { t } = useTranslation('searchUsage')

  const header: IRow = {
    cells: columns.map((column) => ({ id: column, value: t(column) })),
  }
  const body: IRow[] = rows.map((row, index) => ({
    id: `row-${index}`,
    cells: columns.map((column) => {
      const value = row[column] as string | number
      return {
        id: `${column}-${index}`,
        value: row.valueFormat?.[column] === 'percentage' ? `${value}%` : value,
      }
    }),
  }))

  return (
    <ReadOnlyTable
      componentId={componentId}
      header={header}
      body={body}
      fullWidth
    />
  )
}

export default TermsGrid
