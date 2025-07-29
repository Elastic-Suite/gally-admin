import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import {
  ICategory,
  IConfigurations,
  IGraphqlProductPosition,
  IGraphqlSearchProducts,
  IParsedCategoryConfiguration,
  IProductFieldFilterInput,
  IProductPositions,
  IRuleEngineOperators,
  ITableRow,
  LoadStatus,
  ProductRequestType,
  cleanBeforeSaveCatConf,
  getIdFromIri,
  getSearchPreviewProductsQuery,
  productTableheader,
  serializeCatConf,
} from '@elastic-suite/gally-admin-shared'

import { catalogContext } from '../../../contexts'
import { useGraphqlApi } from '../../../hooks'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TopProductsTable from '../TopProductsTable/TopProductsTable'

interface IProps {
  category: ICategory
  onSelectedRows: (rowIds: string[]) => void
  productGraphqlFilters: IProductFieldFilterInput
  selectedRows: (string | number)[]
  setProductPositions: Dispatch<SetStateAction<IGraphqlProductPosition>>
  topProducts: IProductPositions
  topProductsIds: string[]
  sortValue: string
  configuration: IConfigurations
  searchValue: string
  setNbTopRows: (value: number) => void
  catConf: IParsedCategoryConfiguration
  ruleOperators: IRuleEngineOperators
  hasEditLink?: boolean
  editLink?: string
  componentId?: string
}

function TopTable(props: IProps): JSX.Element {
  const {
    category,
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
    catConf,
    ruleOperators,
    hasEditLink,
    editLink,
    componentId,
  } = props
  const { localizedCatalogIdWithDefault } = useContext(catalogContext)

  const variables = useMemo(
    () => ({
      currentCategoryId: category?.id,
      localizedCatalog: localizedCatalogIdWithDefault,
      requestType: ProductRequestType.CATALOG,
      currentCategoryConfiguration: catConf
        ? JSON.stringify(
            cleanBeforeSaveCatConf(serializeCatConf(catConf, ruleOperators))
          )
        : undefined,
    }),
    [category, localizedCatalogIdWithDefault, catConf, ruleOperators]
  )
  const filters = productGraphqlFilters ? [productGraphqlFilters] : []
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
    getSearchPreviewProductsQuery(filters),
    variables
  )

  function handleReorder(rows: ITableRow[]): void {
    let position = 0
    const positions = rows.map((row) => ({
      productId: getIdFromIri(String(row.id)),
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
        topProductsMap[getIdFromIri(a.id)] - topProductsMap[getIdFromIri(b.id)]
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
        hasEditLink={hasEditLink}
        editLink={editLink}
        componentId={componentId}
      />
    )
  )
}

export default TopTable
