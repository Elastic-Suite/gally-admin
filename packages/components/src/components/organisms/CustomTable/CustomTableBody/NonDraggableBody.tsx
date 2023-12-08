import React, { FunctionComponent, SyntheticEvent } from 'react'
import { TableBody } from '@mui/material'
import {
  IConfigurations,
  IFieldGuesserProps,
  ITableConfig,
  ITableHeader,
  ITableRow,
} from '@elastic-suite/gally-admin-shared'

import NonDraggableRow from '../CustomTableRow/NonDraggableRow'

interface IProps {
  Field: FunctionComponent<IFieldGuesserProps>
  cssLeftValues: number[]
  diffRows?: ITableRow[]
  isHorizontalOverflow: boolean
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ) => void
  onSelectRows: (arr: (string | number)[]) => void
  selectedRows: (string | number)[]
  shadow: boolean
  tableConfigs?: ITableConfig[]
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  withSelection: boolean
  configuration: IConfigurations
  hasEditLink?: boolean
  editLink?: string
  withoutDragableColumn?: boolean
}

function NonDraggableBody(props: IProps): JSX.Element {
  const {
    Field,
    cssLeftValues,
    diffRows,
    isHorizontalOverflow,
    onRowUpdate,
    onSelectRows,
    selectedRows,
    shadow,
    tableConfigs,
    tableHeaders,
    tableRows,
    withSelection,
    configuration,
    hasEditLink,
    editLink,
    withoutDragableColumn,
  } = props

  const newTableRows = hasEditLink
    ? tableRows.map((item) => {
        const link = editLink
          ? `${editLink}?id=${item.id}`
          : `./edit?id=${item.id}`
        return { ...item, edit: link }
      })
    : tableRows

  return (
    <TableBody>
      {newTableRows.map((tableRow, index) => (
        <NonDraggableRow
          Field={Field}
          cssLeftValues={cssLeftValues}
          diffRow={diffRows?.[index]}
          isHorizontalOverflow={isHorizontalOverflow}
          key={tableRow.id}
          onRowUpdate={onRowUpdate}
          onSelectRows={onSelectRows}
          selectedRows={selectedRows}
          shadow={shadow}
          tableConfig={tableConfigs?.[index]}
          tableHeaders={tableHeaders}
          tableRow={tableRow}
          withSelection={withSelection}
          configuration={configuration}
          withoutDragableColumn={withoutDragableColumn}
        />
      ))}
    </TableBody>
  )
}

export default NonDraggableBody
