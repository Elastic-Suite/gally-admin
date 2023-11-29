import {
  IGraphqlProduct,
  IProductPositions,
  IRequestTypesOptions,
} from '../types'
import { getIdFromIri } from './format'

export function sortProductCollection(
  products: IGraphqlProduct[],
  positions: IProductPositions
): IGraphqlProduct[] {
  const sortedProducts = [...products]
  const positionsMap = Object.fromEntries(
    positions.map(({ position, productId }) => [productId, position])
  )

  return sortedProducts.sort(
    (a, b) =>
      positionsMap[getIdFromIri(a.id)] - positionsMap[getIdFromIri(b.id)]
  )
}

export function getLimitationType(
  requestType: string,
  options: IRequestTypesOptions[]
): string | undefined {
  return options.find((option) => requestType === option.id)?.limitationType
}
