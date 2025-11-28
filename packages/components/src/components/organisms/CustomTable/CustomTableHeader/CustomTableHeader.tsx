import React, { ChangeEvent } from 'react'
import { Checkbox, TableHead, TableRow } from '@mui/material'
import {
  DataContentType,
  ITableHeader,
  ITableHeaderSticky,
  columnMaxWidth,
  reorderingColumnWidth,
  selectionColumnWidth,
  stickyColumnMaxWidth,
  stickyColumnPadding,
  stickyColumnWidth,
} from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'

import { manageStickyHeaders, stickyBorderStyle } from '../../../../services'

import { BaseTableCell, StickyTableCell } from '../CustomTable.styled'
import InfoTooltip from '../../../atoms/form/InfoTooltip'

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
              zIndex: 3,
              minWidth: `${stickyColumnWidth}px`,
              borderLeft: 'none',
              padding: stickyColumnPadding,
              ...(stickyHeader.isLastSticky && stickyBorderStyle(shadow)),
              ...(stickyHeader.type === DataContentType.STRING && {
                overflow: 'hidden',
                maxWidth: `${stickyColumnMaxWidth}px`,
                textOverflow: 'ellipsis',
              }),
            }}
          >
            {stickyHeader.label}
            {stickyHeader.gridHeaderInfoTooltip?.trim() ? (
              <InfoTooltip
                title={t(stickyHeader.gridHeaderInfoTooltip)}
                withHTMLTitle
              />
            ) : null}
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
                ...(header.type === DataContentType.STOCK && {
                  width: '15%',
                }),
                ...(header.type === DataContentType.STRING && {
                  overflow: 'hidden',
                  maxWidth: `${columnMaxWidth}px`,
                  textOverflow: 'ellipsis',
                }),
                ...header.headerStyle,
              }}
              title={t(header.label)}
            >
              {t(header.label)}
              {header.gridHeaderInfoTooltip?.trim() ? (
                <InfoTooltip
                  title={t(header.gridHeaderInfoTooltip)}
                  withHTMLTitle
                />
              ) : null}
            </BaseTableCell>
          ))}
      </TableRow>
    </TableHead>
  )
}

export default CustomTableHeader
