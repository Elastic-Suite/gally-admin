import React, {
  ChangeEvent,
  FunctionComponent,
  MutableRefObject,
  SyntheticEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

import {
  DataContentType,
  IConfigurations,
  IFieldGuesserProps,
  ITableConfig,
  ITableHeader,
  ITableRow,
  reorderingColumnWidth,
  selectionColumnWidth,
  stickyColunWidth,
} from '@elastic-suite/gally-admin-shared'

import { useIsHorizontalOverflow } from '../../../hooks'

import {
  StyledTable,
  TableContainerWithCustomScrollbar,
} from './CustomTable.styled'
import DraggableBody from './CustomTableBody/DraggableBody'
import NonDraggableBody from './CustomTableBody/NonDraggableBody'
import CustomTableHeader from './CustomTableHeader/CustomTableHeader'

export interface ICustomTableProps {
  Field: FunctionComponent<IFieldGuesserProps>
  border?: boolean
  diffRows?: ITableRow[]
  draggable?: boolean
  massiveSelectionState?: boolean
  massiveSelectionIndeterminate?: boolean
  onReOrder?: (rows: ITableRow[]) => void
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ) => void
  onSelection?: (rowIds: (string | number)[] | boolean) => void
  selectedRows?: (string | number)[]
  tableConfigs?: ITableConfig[]
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  withSelection?: boolean
  configuration?: IConfigurations
  hasUpdateLink?: boolean
  updateLink?: string
}

function CustomTable(
  props: ICustomTableProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    Field,
    border,
    diffRows,
    draggable,
    massiveSelectionState,
    massiveSelectionIndeterminate,
    onReOrder,
    onRowUpdate,
    onSelection,
    tableConfigs,
    tableHeaders,
    tableRows,
    selectedRows,
    withSelection,
    configuration,
    hasUpdateLink,
    updateLink,
  } = props

  const [scrollLength, setScrollLength] = useState<number>(0)
  const tableRef = useRef<HTMLDivElement>()
  const { current: refCurrent } = ref ?? tableRef
  const { isOverflow, shadow } = useIsHorizontalOverflow(refCurrent)

  useEffect(() => {
    if (refCurrent?.scrollTo) {
      refCurrent.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRows.length, tableRows?.[0]?.id, refCurrent])

  /**
   * Compute the length of the sticky part.
   * For now, each sticky colun have a fixed width of 200px but it could ( maybe should ) be improve by seeting an array of width provide by props if needed.
   */
  const stickyLength =
    tableHeaders.filter((header) => header.sticky).length * stickyColunWidth

  let handleDragEnd = null
  if (draggable) {
    handleDragEnd = (e: DropResult): void => {
      if (!e.destination) return
      const tempData = Array.from(tableRows)
      const [source_data] = tempData.splice(e.source.index, 1)
      tempData.splice(e.destination.index, 0, source_data)
      onReOrder?.(tempData)
    }
  }

  /**
   * Compute the CSS left values for the sticky part of the table.
   * It return an array of all successive left value to use in CustomTableHeader.tsx, DraggableTableRow.tsx and CustomTableRows.tsx
   * It gonna be provide to each row component.
   */
  function computeLeftCSSValues(): number[] {
    const stickyHeaders = tableHeaders.filter((header) => header.sticky)
    const result: number[] = [0]
    let eachLeftvalues: number[] = [0]
    eachLeftvalues.push(reorderingColumnWidth)

    if (withSelection) {
      eachLeftvalues.push(selectionColumnWidth)
    }
    if (stickyHeaders.length > 0) {
      eachLeftvalues = eachLeftvalues.concat(
        Array(stickyHeaders.length).fill(stickyColunWidth)
      )
    }
    eachLeftvalues.reduce(
      (leftPrevious, leftCurrent, i) => (result[i] = leftPrevious + leftCurrent)
    )
    return result
  }
  const cssLeftValues = computeLeftCSSValues()

  useEffect(() => {
    if (withSelection) {
      setScrollLength(
        selectionColumnWidth + stickyLength + reorderingColumnWidth
      )
    } else {
      setScrollLength(stickyLength + reorderingColumnWidth)
    }
  }, [withSelection, stickyLength, draggable])

  const styles = border
    ? {
        border: '2px solid #ED7465',
        borderTop: 'none',
        borderRadius: '0px 0px 8px 8px',
        boxSizing: 'border-box',
      }
    : {}

  function handleSelection(event: ChangeEvent<HTMLInputElement>): void {
    onSelection(event.target.checked)
  }

  const newHeadersTable = hasUpdateLink
    ? tableHeaders.concat([
        {
          id: 'actions',
          name: 'edit',
          label: 'Actions',
          input: DataContentType.BUTTON,
        },
      ])
    : tableHeaders

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TableContainerWithCustomScrollbar
          ref={ref ?? tableRef}
          sx={{
            '&::-webkit-scrollbar-track': {
              marginLeft: `${scrollLength}px`,
            },
            '&::-webkit-scrollbar-thumb': {
              marginLeft: `${scrollLength}px`,
            },
            ...styles,
          }}
        >
          <StyledTable stickyHeader>
            <CustomTableHeader
              cssLeftValues={cssLeftValues}
              isHorizontalOverflow={isOverflow}
              massiveSelectionIndeterminate={massiveSelectionIndeterminate}
              massiveSelectionState={massiveSelectionState}
              onSelection={handleSelection}
              shadow={shadow}
              tableHeaders={newHeadersTable}
              withSelection={withSelection}
            />
            {Boolean(!draggable) && (
              <NonDraggableBody
                Field={Field}
                cssLeftValues={cssLeftValues}
                diffRows={diffRows}
                isHorizontalOverflow={isOverflow}
                onRowUpdate={onRowUpdate}
                onSelectRows={onSelection}
                selectedRows={selectedRows}
                shadow={shadow}
                tableConfigs={tableConfigs}
                tableHeaders={newHeadersTable}
                tableRows={tableRows}
                withSelection={withSelection}
                configuration={configuration}
                hasUpdateLink={hasUpdateLink}
                updateLink={updateLink}
              />
            )}
            {Boolean(draggable) && (
              <DraggableBody
                Field={Field}
                cssLeftValues={cssLeftValues}
                diffRows={diffRows}
                isHorizontalOverflow={isOverflow}
                onRowUpdate={onRowUpdate}
                onSelectRows={onSelection}
                selectedRows={selectedRows}
                shadow={shadow}
                tableConfigs={tableConfigs}
                tableHeaders={newHeadersTable}
                tableRows={tableRows}
                withSelection={withSelection}
                configuration={configuration}
                hasUpdateLink={hasUpdateLink}
                updateLink={updateLink}
              />
            )}
          </StyledTable>
        </TableContainerWithCustomScrollbar>
      </DragDropContext>
    </>
  )
}

export default forwardRef(CustomTable)
