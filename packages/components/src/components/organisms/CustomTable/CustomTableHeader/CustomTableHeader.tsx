import React, { ChangeEvent } from 'react'
import { Checkbox, TableHead, TableRow } from '@mui/material'
import {
  DataContentType,
  ITableHeader,
  ITableHeaderSticky,
  reorderingColumnWidth,
  selectionColumnWidth,
  stickyColunWidth,
} from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'

import { manageStickyHeaders, stickyBorderStyle } from '../../../../services'

import { BaseTableCell, StickyTableCell } from '../CustomTable.styled'

interface IProps {
  cssLeftValues: number[]
  isHorizontalOverflow: boolean
  massiveSelectionIndeterminate: boolean
  massiveSelectionState?: boolean
  onSelection?: (e: ChangeEvent<HTMLInputElement>) => void
  shadow: boolean
  tableHeaders: ITableHeader[]
  withSelection: boolean
  withoutDragableColumn?: boolean
}

function CustomTableHeader(props: IProps): JSX.Element {
  const {
    cssLeftValues,
    isHorizontalOverflow,
    massiveSelectionIndeterminate,
    massiveSelectionState,
    onSelection,
    shadow,
    tableHeaders,
    withSelection,
    withoutDragableColumn,
  } = props

  const stickyHeaders: ITableHeaderSticky[] = manageStickyHeaders(tableHeaders)
  const isOnlyDraggable = !withSelection && stickyHeaders.length === 0
  const { t } = useTranslation('api')

  return (
    <TableHead>
      <TableRow
        sx={{
          backgroundColor: 'neutral.light',
        }}
      >
        {Boolean(!withoutDragableColumn || withSelection) && (
          <StickyTableCell
            sx={{
              minWidth: `${reorderingColumnWidth}px`,
              width: `${reorderingColumnWidth}px`,
              borderBottomColor: 'colors.neutral.300',
              borderTopColor: 'colors.neutral.300',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              backgroundColor: 'neutral.light',
              ...(!isOnlyDraggable && { borderRight: 'none' }),
              ...(isOnlyDraggable &&
                isHorizontalOverflow &&
                stickyBorderStyle(shadow)),
              left: `${cssLeftValues[0]}px`,
              zIndex: 3,
            }}
          >
            &nbsp;
          </StickyTableCell>
        )}

        {Boolean(withSelection) && (
          <StickyTableCell
            sx={{
              borderBottomColor: 'colors.neutral.300',
              borderTopColor: 'colors.neutral.300',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              backgroundColor: 'neutral.light',
              width: `${selectionColumnWidth}px`,
              minWidth: `${selectionColumnWidth}px`,
              left: `${cssLeftValues[1]}px`,
              ...(isHorizontalOverflow &&
                stickyHeaders.length === 0 &&
                stickyBorderStyle(shadow)),
              zIndex: 3,
            }}
            key="header-massiveselection"
          >
            <Checkbox
              data-testid="massive-selection"
              indeterminate={massiveSelectionIndeterminate}
              checked={massiveSelectionState}
              onChange={onSelection}
            />
          </StickyTableCell>
        )}

        {stickyHeaders.map((stickyHeader, i) => (
          <StickyTableCell
            key={stickyHeader.name}
            sx={{
              left: `${cssLeftValues[i + 1 + Number(withSelection)]}px`,
              borderBottomColor: 'colors.neutral.300',
              borderTopColor: 'colors.neutral.300',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              backgroundColor: 'neutral.light',
              zIndex: '1',
              minWidth: `${stickyColunWidth}px`,
              borderLeft: 'none',
              ...(stickyHeader.isLastSticky && stickyBorderStyle(shadow)),
            }}
          >
            {stickyHeader.label}
          </StickyTableCell>
        ))}

        {tableHeaders
          .filter((header) => !header.sticky)
          .map((header) => (
            <BaseTableCell
              key={header.name}
              sx={{
                height: '20px',
                padding: '14px 16px',
                borderBottomColor: 'colors.neutral.300',
                borderTopColor: 'colors.neutral.300',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                backgroundColor: 'neutral.light',
                whiteSpace: 'nowrap',
                ...((header.type === DataContentType.SCORE ||
                  header.type === DataContentType.PRICE) && { width: '10%' }),
                ...(header.type === DataContentType.STOCK && { width: '15%' }),
                ...(header.type === DataContentType.STRING && {
                  maxWidth: 'fit-content',
                }),
                ...header.headerStyle,
              }}
            >
              {t(header.label)}
            </BaseTableCell>
          ))}
      </TableRow>
    </TableHead>
  )
}

export default CustomTableHeader
