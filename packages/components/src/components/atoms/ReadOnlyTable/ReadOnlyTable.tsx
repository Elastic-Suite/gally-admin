import React from 'react'
import { IRow, ReadOnlyTableRow, StyledTable } from './ReadOnlyTable.styled'
import { TestId, generateTestId } from '../../../utils/testIds'

export interface IReadOnlyTable {
  header: IRow
  body: IRow[]
  fullWidth?: boolean
  componentId?: string
}

function ReadOnlyTable({
  header,
  body,
  fullWidth,
  componentId,
}: IReadOnlyTable): JSX.Element {
  const displayCollapseButton = body.filter((row) => row.subRows).length > 0

  return (
    <StyledTable
      sx={fullWidth ? { width: '100%' } : null}
      data-testid={generateTestId(TestId.READ_ONLY_TABLE, componentId)}
    >
      <thead>
        <ReadOnlyTableRow
          row={header}
          displayCollapseButton={displayCollapseButton}
          componentId={componentId}
        />
      </thead>
      <tbody>
        {body.map((row) => (
          <ReadOnlyTableRow
            key={row.id}
            row={row}
            displayCollapseButton={displayCollapseButton}
            componentId={componentId}
          />
        ))}
      </tbody>
    </StyledTable>
  )
}

export default ReadOnlyTable
