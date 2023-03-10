import React, {
  MutableRefObject,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'next-i18next'
import { Box } from '@mui/material'
import {
  IConfigurations,
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  ITableRow,
  ProductRequestType,
  defaultPageSize,
  defaultRowsPerPageOptions,
  getSearchProductsQuery,
  productTableheader,
} from '@elastic-suite/gally-admin-shared'

import { catalogContext } from '../../../contexts'
import { useGraphqlApi } from '../../../hooks'

import NoAttributes from '../../atoms/noAttributes/NoAttributes'
import PagerTable from '../../organisms/PagerTable/PagerTable'

import FieldGuesser from '../FieldGuesser/FieldGuesser'

interface IProps {
  onSelectedRows: (rowIds: string[]) => void
  productGraphqlFilters: IProductFieldFilterInput
  selectedRows: (string | number)[]
  topProductsIds: number[]
  setNbBottomRows: (value: number) => void
  sortValue: string
  searchValue: string
  configuration: IConfigurations
  nbTopProducts: number
}

function BottomTable(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    onSelectedRows,
    productGraphqlFilters,
    selectedRows,
    topProductsIds,
    setNbBottomRows,
    sortValue,
    searchValue,
    configuration,
    nbTopProducts,
  } = props
  const { localizedCatalogIdWithDefault } = useContext(catalogContext)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)
  const { t } = useTranslation('categories')
  const variables = useMemo(
    () => ({
      localizedCatalog: localizedCatalogIdWithDefault,
      currentPage,
      pageSize: rowsPerPage,
      requestType: ProductRequestType.CATALOG,
      sort:
        sortValue && sortValue !== 'category__position'
          ? { [sortValue]: 'asc' }
          : {},
    }),
    [currentPage, localizedCatalogIdWithDefault, rowsPerPage, sortValue]
  )
  const filters = [productGraphqlFilters]
  if (topProductsIds.length > 0 && sortValue === 'category__position') {
    filters.push({
      boolFilter: { _not: [{ id: { in: topProductsIds } }] },
    })
  }

  if (searchValue) {
    filters.push({
      boolFilter: {
        _should: [
          {
            name: { match: searchValue },
          },
          { sku: { eq: searchValue } },
        ],
      },
    })
  }

  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(filters),
    variables
  )

  function onPageChange(page: number): void {
    setCurrentPage(page + 1)
    onSelectedRows([])
  }

  const tableRows = products?.data?.products.collection ?? []
  const withSelection = selectedRows?.length !== undefined
  const massiveSelectionState =
    withSelection && selectedRows
      ? selectedRows.length === tableRows.length
      : false
  const massiveSelectionIndeterminate =
    withSelection && selectedRows.length > 0
      ? selectedRows.length < tableRows.length
      : false

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  useEffect(() => {
    setNbBottomRows(products?.data?.products.paginationInfo.totalCount || 0)
  }, [products?.data?.products.paginationInfo.totalCount, setNbBottomRows])

  function handleSelection(rowIds: (string | number)[] | boolean): void {
    if (rowIds instanceof Array) {
      onSelectedRows(rowIds as string[])
    } else if (rowIds) {
      onSelectedRows(tableRows.map((row) => row.id))
    } else {
      onSelectedRows([])
    }
  }

  const hasProduct = Boolean(nbTopProducts + tableRows.length)

  return (
    <>
      {Boolean(products?.data?.products) &&
        (!hasProduct ? (
          <NoAttributes title={t('noProductSearch')} />
        ) : (
          products.data.products.collection.length !== 0 && (
            <Box
              sx={
                nbTopProducts !== 0 && sortValue === 'category__position'
                  ? { marginTop: '24px' }
                  : {}
              }
            >
              <PagerTable
                Field={FieldGuesser}
                count={products.data.products.paginationInfo.totalCount}
                currentPage={
                  (currentPage - 1 >= 0 ? currentPage - 1 : currentPage) ?? 0
                }
                massiveSelectionIndeterminate={massiveSelectionIndeterminate}
                massiveSelectionState={massiveSelectionState}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                onSelection={handleSelection}
                ref={ref}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={defaultRowsPerPageOptions ?? []}
                selectedRows={selectedRows}
                tableHeaders={productTableheader}
                tableRows={
                  products.data.products.collection as unknown as ITableRow[]
                }
                withSelection={withSelection}
                configuration={configuration}
              />
            </Box>
          )
        ))}
    </>
  )
}

export default forwardRef(BottomTable)
