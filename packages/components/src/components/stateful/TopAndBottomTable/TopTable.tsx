import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import {
  IConfigurations,
  IGraphqlProductPosition,
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  IProductPositions,
  ITableRow,
  LoadStatus,
  ProductRequestType,
  getSearchProductsQuery,
  productTableheader,
} from '@elastic-suite/gally-admin-shared'

import { catalogContext } from '../../../contexts'
import { useGraphqlApi } from '../../../hooks'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TopProductsTable from '../TopProductsTable/TopProductsTable'

interface IProps {
  onSelectedRows: (rowIds: string[]) => void
  productGraphqlFilters: IProductFieldFilterInput
  selectedRows: (string | number)[]
  setProductPositions: Dispatch<SetStateAction<IGraphqlProductPosition>>
  topProducts: IProductPositions
  topProductsIds: number[]
  sortValue: string
  configuration: IConfigurations
  searchValue: string
  setNbTopRows: (value: number) => void
  hasUpdateLink?: boolean
  updateLink?: string
}

function TopTable(props: IProps): JSX.Element {
  const {
    selectedRows,
    onSelectedRows,
    productGraphqlFilters,
    setProductPositions,
    topProducts,
    topProductsIds,
    sortValue,
    configuration,
    searchValue,
    setNbTopRows,
    hasUpdateLink,
    updateLink,
  } = props
  const { localizedCatalogIdWithDefault } = useContext(catalogContext)

  const variables = useMemo(
    () => ({
      localizedCatalog: localizedCatalogIdWithDefault,
      requestType: ProductRequestType.CATALOG,
    }),
    [localizedCatalogIdWithDefault]
  )
  const filters = [productGraphqlFilters]
  if (topProductsIds.length > 0) {
    filters.push({ id: { in: topProductsIds } })
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

  function handleReorder(rows: ITableRow[]): void {
    let position = 0
    const positions = rows.map((row) => ({
      productId: Number(String(row.id).split('/')[2]),
      position: ++position,
    }))
    setProductPositions({
      getPositionsCategoryProductMerchandising: {
        result: JSON.stringify(positions),
      },
    })
  }

  useEffect(() => {
    setNbTopRows(products?.data?.products.paginationInfo.totalCount || 0)
  }, [products?.data?.products.paginationInfo.totalCount, setNbTopRows])

  const topProductsMap = Object.fromEntries(
    topProducts.map(({ position, productId }) => [productId, position])
  )
  const tableRows =
    (products.data?.products?.collection.sort(
      (a, b) =>
        topProductsMap[a.id.split('/')[2]] - topProductsMap[b.id.split('/')[2]]
    ) as unknown as ITableRow[]) ?? []
  const withSelection = selectedRows?.length !== undefined
  const massiveSelectionState =
    withSelection && selectedRows
      ? selectedRows.length === tableRows.length
      : false
  const massiveSelectionIndeterminate =
    withSelection && selectedRows.length > 0
      ? selectedRows.length < tableRows.length
      : false

  function handleSelection(rowIds: (string | number)[] | boolean): void {
    if (rowIds instanceof Array) {
      onSelectedRows(rowIds as string[])
    } else if (rowIds) {
      onSelectedRows(products.data.products.collection.map((row) => row.id))
    } else {
      onSelectedRows([])
    }
  }

  return (
    products.status === LoadStatus.SUCCEEDED &&
    sortValue === 'category__position' &&
    tableRows.length !== 0 && (
      <TopProductsTable
        border
        draggable
        Field={FieldGuesser}
        massiveSelectionIndeterminate={massiveSelectionIndeterminate}
        massiveSelectionState={massiveSelectionState}
        onReOrder={handleReorder}
        onSelection={handleSelection}
        selectedRows={selectedRows}
        tableHeaders={productTableheader}
        tableRows={tableRows}
        withSelection={withSelection}
        configuration={configuration}
        hasUpdateLink={hasUpdateLink}
        updateLink={updateLink}
      />
    )
  )
}

export default TopTable
