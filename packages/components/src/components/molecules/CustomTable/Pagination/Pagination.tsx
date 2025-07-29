import React, { CSSProperties, ChangeEvent, MouseEvent, ReactNode } from 'react'
import {
  Box,
  IconButtonProps,
  LabelDisplayedRowsArgs,
  SelectProps,
  TablePagination,
} from '@mui/material'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import { theme } from '@elastic-suite/gally-admin-shared'
import { TestId, generateTestId } from '../../../../utils/testIds'

interface IPaginationStyle {
  color: string
  fontFamily: string
  fontSize: string
  lineHeight: string
}

const paginationStyle: IPaginationStyle = {
  color: theme.palette.colors.neutral[600],
  fontFamily: 'var(--gally-font)',
  fontSize: '12px',
  lineHeight: '18px',
}

const PaginationTextContainer = styled('span')({
  ...paginationStyle,
})

const StyledParagraph = styled('p')({
  fontFamily: 'var(--gally-font)',
  fontSize: '12px',
  fontWeight: 400,
  color: '#424880',
  lineHeight: '18px',
  margin: 0,
})

interface IProps {
  style?: CSSProperties
  withResults?: boolean
  isBottom?: boolean
  count: number
  currentPage: number
  rowsPerPage: number
  rowsPerPageOptions: number[]
  componentId?: string
  onRowsPerPageChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  onPageChange: (page: number) => void
}

function Pagination(props: IProps): JSX.Element {
  const {
    style,
    withResults,
    isBottom,
    count,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onRowsPerPageChange,
    onPageChange,
    componentId,
  } = props

  const { t } = useTranslation('common')

  function handlePageChange(
    _: MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void {
    onPageChange(page)
  }

  function labelDisplayedRows(
    paginationInfo: LabelDisplayedRowsArgs
  ): ReactNode {
    return (
      <PaginationTextContainer>
        <span data-testid={generateTestId(TestId.PAGINATION_FROM, componentId)}>
          {paginationInfo.from}
        </span>{' '}
        -{' '}
        <span data-testid={generateTestId(TestId.PAGINATION_TO, componentId)}>
          {paginationInfo.to}
        </span>{' '}
        {t('pagination.of')}{' '}
        <span
          data-testid={generateTestId(TestId.PAGINATION_COUNT, componentId)}
        >
          {paginationInfo.count}
        </span>
      </PaginationTextContainer>
    )
  }

  const labelRowsPerPage = (
    <PaginationTextContainer>
      {' '}
      {t('pagination.rowsPerPage')}
    </PaginationTextContainer>
  )

  const selectProps: Partial<SelectProps<null>> = {
    SelectDisplayProps: {
      style: {
        ...paginationStyle,
      },
    },
  }

  const nextAndBackButtonProps: Partial<IconButtonProps<'button', unknown>> = {
    sx: { color: theme.palette.colors.neutral['900'] },
  }

  return (
    <Box
      sx={{
        ...(isBottom && {
          borderRadius: '0 0 8px 8px',
        }),
        ...(!isBottom && {
          borderRadius: '8px 8px 0 0',
        }),
        bgcolor: 'colors.white',
        ...(withResults && {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          border: '1px solid #E2E6F3',
          padding: '0 22px',
        }),
        ...style,
      }}
      data-testid={generateTestId(TestId.PAGINATION, componentId)}
    >
      {Boolean(withResults) && (
        <StyledParagraph>{t(`result`, { count })}</StyledParagraph>
      )}
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={count}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        labelDisplayedRows={labelDisplayedRows}
        labelRowsPerPage={labelRowsPerPage}
        SelectProps={selectProps}
        nextIconButtonProps={nextAndBackButtonProps}
        backIconButtonProps={nextAndBackButtonProps}
      />
    </Box>
  )
}

export default Pagination
