import React, { useMemo } from 'react'
import {
  IConfigurations,
  IExplainVariables,
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  IProductPositions,
  ITableRow,
  getIdFromIri,
  getSearchProductsQuery,
  productTableheader,
  sortProductCollection,
} from '@elastic-suite/gally-admin-shared'

import { useGraphqlApi } from '../../../hooks'
import TopProductsTable from '../TopProductsTable/TopProductsTable'
import FieldGuesser from '../FieldGuesser/FieldGuesser'

interface IProps {
  variables: IExplainVariables
  configuration: IConfigurations
  topProducts: IProductPositions
}

function ProductsPreviewTop(props: IProps): JSX.Element {
  const { variables, configuration, topProducts } = props

  const filters: IProductFieldFilterInput[] = []
  if (topProducts.length > 0) {
    filters.push({
      id: { in: topProducts.map((product) => product.productId) },
    })
  }

  const variablesFormatted = useMemo(() => {
    return {
      requestType: variables.requestType,
      localizedCatalog: getIdFromIri(String(variables.localizedCatalog)),
      currentCategoryId: variables.category.id,
    }
  }, [variables])

  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(filters),
    variablesFormatted
  )

  const tableRows = sortProductCollection(
    products?.data?.products?.collection ?? [],
    topProducts
  ) as unknown as ITableRow[]

  return (
    <>
      {tableRows.length > 0 && (
        <TopProductsTable
          border
          Field={FieldGuesser}
          tableHeaders={productTableheader}
          tableRows={tableRows}
          configuration={configuration}
        />
      )}
    </>
  )
}

export default ProductsPreviewTop
