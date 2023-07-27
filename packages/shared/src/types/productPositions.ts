export interface IGraphqlProductPosition {
  getPositionsCategoryProductMerchandising: {
    result: string
  }
}

export interface IProductPosition {
  productId: string
  position: number
}

export type IProductPositions = IProductPosition[]
