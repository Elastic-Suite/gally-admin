import React, { useEffect, useMemo } from 'react'
import {
  IConfigurations,
  IExplainVariables,
  IGraphqlProductPosition,
  IProductPositions,
  LoadStatus,
  getIdFromIri,
  getProductPosition,
} from '@elastic-suite/gally-admin-shared'

import { useGraphqlApi } from '../../../hooks'
import ProductsPreviewTop from './ProductsPreviewTop'
import ProductsPreviewBottom from './ProductsPreviewBottom'
import { Box } from '@mui/material'
import { styled } from '@mui/system'

const BoxStyled = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}))

interface IProps {
  variables: IExplainVariables
  configuration: IConfigurations
  limitationType: string
  onProductsLoaded?: (nbResults: number) => void
  onTopProductsLoaded?: (nbTopProducts: number) => void
}

function ProductsCategoryPreview(props: IProps): JSX.Element {
  const {
    variables,
    configuration,
    limitationType,
    onProductsLoaded,
    onTopProductsLoaded,
  } = props

  const positionVariables = useMemo(
    () => ({
      localizedCatalogId: Number(
        getIdFromIri(String(variables.localizedCatalog))
      ),
      categoryId: variables?.category?.id,
    }),
    [variables.localizedCatalog, variables?.category?.id]
  )

  const [productPositions] = useGraphqlApi<IGraphqlProductPosition>(
    getProductPosition,
    positionVariables
  )

  const topProducts = productPositions?.data
    ? (JSON.parse(
        productPositions.data.getPositionsCategoryProductMerchandising.result
      ) as IProductPositions)
    : []

  useEffect(() => {
    if (
      onTopProductsLoaded &&
      productPositions.status === LoadStatus.SUCCEEDED
    ) {
      onTopProductsLoaded(topProducts.length)
    }
  }, [productPositions, topProducts.length, onTopProductsLoaded])

  return (
    <>
      {productPositions.status === LoadStatus.SUCCEEDED &&
        topProducts.length > 0 && (
          <BoxStyled>
            <ProductsPreviewTop
              variables={variables}
              configuration={configuration}
              topProducts={topProducts}
            />
          </BoxStyled>
        )}
      {productPositions.status === LoadStatus.SUCCEEDED && (
        <ProductsPreviewBottom
          variables={variables}
          configuration={configuration}
          limitationType={limitationType}
          topProducts={topProducts}
          onProductsLoaded={onProductsLoaded}
        />
      )}
    </>
  )
}

export default ProductsCategoryPreview
