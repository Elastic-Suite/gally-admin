import React from 'react'
import {
  IConfigurations,
  IExplainVariables,
} from '@elastic-suite/gally-admin-shared'

import ProductsPreviewBottom from './ProductsPreviewBottom'

interface IProps {
  variables: IExplainVariables
  configuration: IConfigurations
  limitationType: string
  onProductsLoaded?: (nbResults: number) => void
}

function ProductsSearchPreview(props: IProps): JSX.Element {
  const { variables, configuration, limitationType, onProductsLoaded } = props

  return (
    <ProductsPreviewBottom
      variables={variables}
      configuration={configuration}
      topProducts={[]}
      onProductsLoaded={onProductsLoaded}
      limitationType={limitationType}
    />
  )
}

export default ProductsSearchPreview
