import React, { useEffect, useMemo, useState } from 'react'
import {
  IConfigurations,
  IExplainVariables,
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  IProductPositions,
  ITableRow,
  LoadStatus,
  cleanExplainGraphQLVariables,
  defaultPageSize,
  defaultRowsPerPageOptions,
  getIdFromIri,
  getSearchProductsQuery,
  productTableheader,
} from '@elastic-suite/gally-admin-shared'

import { useGraphqlApi } from '../../../hooks'
import FieldGuesser from '../FieldGuesser/FieldGuesser'
import PagerTable from '../../organisms/PagerTable/PagerTable'
import NoAttributes from '../../atoms/noAttributes/NoAttributes'
import { useTranslation } from 'next-i18next'

interface IProps {
  variables: IExplainVariables
  configuration: IConfigurations
  topProducts: IProductPositions
  limitationType: string
  onProductsLoaded?: (nbResults: number) => void
}

function ProductsPreviewBottom(props: IProps): JSX.Element {
  const {
    variables,
    configuration,
    topProducts,
    limitationType,
    onProductsLoaded,
  } = props
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)
  const { t } = useTranslation('categories')

  const variablesFormatted = useMemo(() => {
    const cleanedVariables = cleanExplainGraphQLVariables(
      variables,
      limitationType
    )
    return {
      requestType: cleanedVariables.requestType,
      localizedCatalog: getIdFromIri(String(cleanedVariables.localizedCatalog)),
      currentCategoryId: cleanedVariables?.category?.id,
      search: cleanedVariables?.search,
      currentPage,
      pageSize: rowsPerPage,
    }
  }, [variables, currentPage, rowsPerPage, limitationType])

  const filters: IProductFieldFilterInput[] = []
  if (topProducts.length > 0) {
    filters.push({
      boolFilter: {
        _not: [{ id: { in: topProducts.map((product) => product.productId) } }],
      },
    })
  }

  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(filters),
    variablesFormatted
  )
  const tableRows =
    (products?.data?.products?.collection as unknown as ITableRow[]) ?? []

  useEffect(() => {
    if (
      typeof onProductsLoaded === 'function' &&
      products.status === LoadStatus.SUCCEEDED
    ) {
      onProductsLoaded(products.data.products.paginationInfo.totalCount)
    }
  }, [products, onProductsLoaded])

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  function onPageChange(page: number): void {
    setCurrentPage(page + 1)
  }

  return (
    <>
      {tableRows.length > 0 ? (
        <PagerTable
          Field={FieldGuesser}
          count={products.data.products.paginationInfo.totalCount}
          currentPage={
            (currentPage - 1 >= 0 ? currentPage - 1 : currentPage) ?? 0
          }
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={defaultRowsPerPageOptions ?? []}
          tableHeaders={productTableheader}
          tableRows={
            products.data.products.collection as unknown as ITableRow[]
          }
          configuration={configuration}
        />
      ) : (
        <NoAttributes title={t('noProductSearch')} />
      )}
    </>
  )
}

export default ProductsPreviewBottom
