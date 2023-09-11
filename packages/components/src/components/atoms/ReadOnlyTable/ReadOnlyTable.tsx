import React from 'react'
import { IRow, ReadOnlyTableRow, StyledTable } from './ReadOnlyTable.styled'

interface IReadOnlyTable {
  header: IRow
  body: IRow[]
}

function ReadOnlyTable({ header, body }: IReadOnlyTable): JSX.Element {
  return (
    <StyledTable>
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
