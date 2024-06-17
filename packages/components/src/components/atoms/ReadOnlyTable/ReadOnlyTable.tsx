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
  return (
    <StyledTable sx={fullWidth ? { width: '100%' } : null}>
      <thead>
        <ReadOnlyTableRow row={header} />
      </thead>
      <tbody>
        {body.map((row) => (
          <ReadOnlyTableRow key={row.id} row={row} />
        ))}
      </tbody>
    </StyledTable>
  )
}

export default ReadOnlyTable
