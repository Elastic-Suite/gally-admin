import React, { ChangeEvent, FunctionComponent, SyntheticEvent } from 'react'
import { Box, Checkbox, TableRow } from '@mui/material'
import { DraggableProvided } from 'react-beautiful-dnd'
import {
  IConfigurations,
  IFieldGuesserProps,
  IImage,
  ITableConfig,
  ITableHeader,
  ITableHeaderSticky,
  ITableRow,
  getImageValue,
  getPropsFromFieldState,
} from '@elastic-suite/gally-admin-shared'

import {
  draggableColumnStyle,
  handleSingleRow,
  manageStickyHeaders,
  nonStickyStyle,
  reorderIconStyle,
  selectionStyle,
  stickyStyle,
} from '../../../../services'

import IonIcon from '../../../atoms/IonIcon/IonIcon'
import {
  BaseTableCell,
  StickyTableCell,
} from '../../CustomTable/CustomTable.styled'

interface IProps {
  Field: FunctionComponent<IFieldGuesserProps>
  cssLeftValues: number[]
  diffDefaultValues?: boolean
  diffRow?: ITableRow
  isHorizontalOverflow: boolean
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ) => void
  onSelectRows: (arr: (string | number)[]) => void
  provider: DraggableProvided
  selectedRows: (string | number)[]
  shadow: boolean
  tableConfig?: ITableConfig
  tableHeaders: ITableHeader[]
  tableRow: ITableRow
  withSelection: boolean
  configuration: IConfigurations
}

function DraggableRow(props: IProps): JSX.Element {
  const {
    Field,
    cssLeftValues,
    diffRow,
    isHorizontalOverflow,
    onRowUpdate,
    onSelectRows,
    provider,
    selectedRows,
    shadow,
    tableConfig,
    tableHeaders,
    tableRow,
    withSelection,
    configuration,
  } = props
  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const nonStickyHeaders = tableHeaders.filter((header) => !header.sticky)
  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0

  function handleSelectionChange(value: ChangeEvent<HTMLInputElement>): void {
    handleSingleRow(value, tableRow.id, onSelectRows, selectedRows)
  }

  function handleChange(
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ): void {
    onRowUpdate(tableRow.id, name, value, event)
  }

  return (
    <TableRow
      key={tableRow.id}
      {...provider.draggableProps}
      ref={provider.innerRef}
    >
      <StickyTableCell
        sx={{
          borderBottomColor: 'colors.neutral.300',
          '&:hover': {
            color: 'colors.neutral.500',
            cursor: 'default',
          },
          ...draggableColumnStyle(
            isOnlyDraggable,
            cssLeftValues[0],
            isHorizontalOverflow,
            shadow
          ),
        }}
        {...provider.dragHandleProps}
      >
        <Box sx={reorderIconStyle}>
          <IonIcon name="reorder-two-outline" />
        </Box>
      </StickyTableCell>

      {Boolean(withSelection) && (
        <StickyTableCell
          sx={selectionStyle(
            isHorizontalOverflow,
            cssLeftValues[1],
            shadow,
            stickyHeaders.length
          )}
        >
          <Checkbox
            checked={selectedRows ? selectedRows.includes(tableRow.id) : false}
            data-testid="draggable-single-row-selection"
            onChange={handleSelectionChange}
            {...tableConfig.selection}
          />
        </StickyTableCell>
      )}

      {stickyHeaders.map(({ gridHeaderInfoTooltip, ...stickyHeader }, i) => (
        <StickyTableCell
          key={stickyHeader.name}
          sx={{
            ...stickyStyle(
              cssLeftValues[i + 1 + Number(withSelection)],
              shadow,
              stickyHeader.isLastSticky,
              stickyHeader.type
            ),
            ...stickyHeader.cellsStyle,
          }}
        >
          <Field
            {...stickyHeader}
            diffValue={diffRow ? diffRow[stickyHeader.name] ?? null : undefined}
            label=""
            onChange={handleChange}
            row={tableRow}
            value={tableRow[stickyHeader.name]}
            {...getPropsFromFieldState(
              tableRow,
              stickyHeader.depends,
              tableConfig[stickyHeader.name]
            )}
          />
        </StickyTableCell>
      ))}

      {nonStickyHeaders.map(({ gridHeaderInfoTooltip, ...header }) => {
        const value =
          tableRow[header.name] && header.input === 'image'
            ? getImageValue(
                configuration['base_url/media'],
                tableRow[header.name] as IImage | string
              )
            : tableRow[header.name]
        return (
          <BaseTableCell
            sx={{ ...nonStickyStyle(header.type), ...header.cellsStyle }}
            key={header.name}
          >
            <Field
              {...header}
              diffValue={diffRow ? diffRow[header.name] ?? null : undefined}
              label=""
              onChange={handleChange}
              row={tableRow}
              value={value}
              {...getPropsFromFieldState(
                tableRow,
                header.depends,
                tableConfig[header.name]
              )}
            />
          </BaseTableCell>
        )
      })}
    </TableRow>
  )
}

DraggableRow.defaultProps = {
  tableConfig: {},
}

export default DraggableRow
