import React from 'react'
import { IRow, ReadOnlyTableRow, StyledTable } from './ReadOnlyTable.styled'

export interface IReadOnlyTable {
  header: IRow
  body: IRow[]
  fullWidth?: boolean
}

function ReadOnlyTable({
  header,
  body,
  fullWidth,
}: IReadOnlyTable): JSX.Element {
  const withoutSubRow = body.filter((row) => row.subRows).length === 0

  return (
    <StyledTable sx={fullWidth ? { width: '100%' } : null}>
      <thead>
        <ReadOnlyTableRow row={header} withoutSubRow={withoutSubRow} />
      </thead>
      <tbody>
        {body.map((row) => (
          <ReadOnlyTableRow
            key={row.id}
            row={row}
            withoutSubRow={withoutSubRow}
          />
        ))}
      </tbody>
    </StyledTable>
  )
}

export default ReadOnlyTable
