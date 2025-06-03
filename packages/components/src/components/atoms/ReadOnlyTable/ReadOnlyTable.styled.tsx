import React, { CSSProperties, ReactNode, useState } from 'react'
import IonIcon from '../IonIcon/IonIcon'
import { ToolTip } from '../modals/Tooltip.stories'
import { Collapse, styled } from '@mui/material'
import classnames from 'classnames'

interface ICell {
  id: string
  bold?: boolean
  onClick?: () => void
  tooltip?: {
    icon: string
    text: string
  }
  value: string | number | ReactNode
  style?: CSSProperties
}

export interface IRow {
  important?: boolean
  cells: ICell[]
  subRows?: IRow[]
  id?: string
}

export const StyledTable = styled('table')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  borderSpacing: theme.spacing(0),
  borderCollapse: 'separate',
  border: '1px solid #E2E6F3',
  fontFamily: 'Inter',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: '20px',
  overflow: 'hidden',

  '.subRows > td': {
    borderBottom: 'none',

    table: {
      display: 'block',
      width: '100%',
      borderCollapse: 'collapse',
      border: 'none',
    },
  },

  '.highlightedBackground': {
    backgroundColor: '#f3f7ff',
    color: '#424880',

    'th, td': {
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      borderBottom: '1px solid #E2E6F3',
    },
  },
  ' & tbody > tr:last-child': {
    'th, td': {
      borderBottom: 'none',
    },
  },
  'th,td': {
    textAlign: 'left',
    color: '#151A47',
    padding: `${theme.spacing(1.75)} ${theme.spacing(2)}`,
    borderBottom: '1px solid #E2E6F3',
    boxSizing: 'border-box',

    '.clickableValue': {
      fontWeight: 600,
      color: '#2C19CD',
      backgroundColor: 'transparent',
      border: 'none',
      padding: 0,
      fontSize: '14px',
      cursor: 'pointer',
    },
  },
  'tr.important': {
    backgroundColor: '#E2E6F3',
    td: {
      fontWeight: 600,
    },
  },
  '& > thead': {
    backgroundColor: '#F4F7FF',
    'td, th': {
      fontWeight: 600,
    },
  },
}))

export function ReadOnlyTableRow({
  row,
  highlightedBackground,
  displayCollapseButton,
}: {
  row: IRow
  highlightedBackground?: boolean
  displayCollapseButton?: boolean
}): JSX.Element {
  const [open, setOpen] = useState(false)

  function handleToggle(): void {
    setOpen((curr) => !curr)
  }

  return (
    <>
      <tr
        className={classnames({
          important: row.important,
          highlightedBackground,
        })}
      >
        {row.cells.map((cell): JSX.Element => {
          return (
            <td
              key={cell.id}
              style={{
                ...(cell.bold && { fontWeight: 600 }),
                ...cell?.style,
              }}
            >
              {cell.onClick ? (
                <button
                  type="button"
                  onClick={cell?.onClick}
                  className="clickableValue"
                >
                  {cell.value}
                </button>
              ) : (
                cell.value
              )}
              {Boolean(cell.tooltip) && (
                <ToolTip
                  title={cell.tooltip?.text}
                  style={{ marginLeft: '8px' }}
                >
                  <span style={{ display: 'inline-block' }}>
                    <IonIcon
                      name={`${cell.tooltip?.icon}`}
                      tooltip
                      style={{ color: '#151A47' }}
                    />
                  </span>
                </ToolTip>
              )}
            </td>
          )
        })}
        {displayCollapseButton ? (
          <td style={{ width: '48px' }}>
            {row.subRows ? (
              <IonIcon
                onClick={handleToggle}
                name={`${open ? 'remove' : 'add'}-circle`}
                style={{
                  color: '#8187B9',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              />
            ) : null}
          </td>
        ) : null}
      </tr>
      {displayCollapseButton && row.subRows ? (
        <tr className="subRows">
          <td style={{ padding: 0 }} colSpan={row.cells.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <table>
                <tbody>
                  {row.subRows?.map(
                    (subRow): JSX.Element => (
                      <ReadOnlyTableRow
                        key={subRow?.id}
                        row={subRow}
                        highlightedBackground
                      />
                    )
                  )}
                </tbody>
              </table>
            </Collapse>
          </td>
        </tr>
      ) : null}
    </>
  )
}
