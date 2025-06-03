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
  const displayCollapseButton = body.filter((row) => row.subRows).length > 0

  return (
    <StyledTable sx={fullWidth ? { width: '100%' } : null}>
      <thead>
        <ReadOnlyTableRow
          row={header}
          displayCollapseButton={displayCollapseButton}
        />
      </thead>
      <tbody>
        {body.map((row) => (
          <ReadOnlyTableRow
            key={row.id}
            row={row}
            displayCollapseButton={displayCollapseButton}
          />
        ))}
      </tbody>
    </StyledTable>
  )
}

export default ReadOnlyTable
