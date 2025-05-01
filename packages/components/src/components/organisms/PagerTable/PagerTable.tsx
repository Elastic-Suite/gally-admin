import React, { ChangeEvent, MutableRefObject, forwardRef } from 'react'
import { styled } from '@mui/system'

import Pagination from '../../molecules/CustomTable/Pagination/Pagination'

import CustomTable, { ICustomTableProps } from '../CustomTable/CustomTable'

import { useTranslation } from 'next-i18next'

const Root = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
}))

const CustomNoResult = styled('div')(({ theme }) => ({
  fontFamily: 'var(--gally-font)',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.colors.neutral[900],
  textAlign: 'center',
  padding: theme.spacing(3),
}))

interface IProps extends ICustomTableProps {
  count: number
  currentPage: number
  noResult?: boolean
  onPageChange: (page: number) => void
  onRowsPerPageChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  rowsPerPage: number
  rowsPerPageOptions: number[]
  dataTestId?: string
}

function PagerTable(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    currentPage,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPage,
    rowsPerPageOptions,
    count,
    noResult,
    dataTestId,
    ...tableProps
  } = props
  const { t } = useTranslation('common')

  return (
    <Root ref={ref}>
      <Pagination
        currentPage={currentPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        count={count}
        dataTestId={dataTestId ? `${dataTestId}TablePagination` : null}
      />

      <CustomTable
        {...tableProps}
        dataTestId={dataTestId ? `${dataTestId}Table` : null}
      />
      {noResult ? <CustomNoResult>{t('no.result')}</CustomNoResult> : null}
      <Pagination
        currentPage={currentPage}
        isBottom
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        count={count}
      />
    </Root>
  )
}

export default forwardRef(PagerTable)
