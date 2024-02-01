import { getLimitationType, sortProductCollection } from './product'
import { LimitationType, ProductRequestType } from '../types'

describe('Product service', () => {
  describe('sortProductCollection', () => {
    it('Should test if product are sorted according to positions', () => {
      expect(
        sortProductCollection(
          [
            {
              id: '1',
              sku: 'sku-bag',
              name: 'bag',
              score: 1,
              stock: { status: true, qty: 10 },
            },
            {
              id: '2',
              sku: 'sku-dress',
              name: 'dress',
              score: 1,
              stock: { status: true, qty: 10 },
            },
          ],
          [
            { position: 10, productId: '2' },
            { position: 20, productId: '1' },
          ]
        )
      ).toEqual([
        {
          id: '2',
          sku: 'sku-dress',
          name: 'dress',
          score: 1,
          stock: { status: true, qty: 10 },
        },
        {
          id: '1',
          sku: 'sku-bag',
          name: 'bag',
          score: 1,
          stock: { status: true, qty: 10 },
        },
      ])
      expect(
        sortProductCollection(
          [
            {
              id: '1',
              sku: 'sku-bag',
              name: 'bag',
              score: 1,
              stock: { status: true, qty: 10 },
            },
            {
              id: '2',
              sku: 'sku-dress',
              name: 'dress',
              score: 1,
              stock: { status: true, qty: 10 },
            },
          ],
          [
            { position: 10, productId: '1' },
            { position: 20, productId: '2' },
          ]
        )
      ).toEqual([
        {
          id: '1',
          sku: 'sku-bag',
          name: 'bag',
          score: 1,
          stock: { status: true, qty: 10 },
        },
        {
          id: '2',
          sku: 'sku-dress',
          name: 'dress',
          score: 1,
          stock: { status: true, qty: 10 },
        },
      ])
    })
  })

  describe('getLimitationType', () => {
    it('Should get limitation type from request type options', () => {
      expect(
        getLimitationType(ProductRequestType.CATALOG, [
          {
            id: ProductRequestType.CATALOG,
            value: ProductRequestType.CATALOG,
            limitationType: LimitationType.CATEGORY,
            label: 'Catalog product view',
            previewLabel: 'Preview Catalog Label',
          },
          {
            id: ProductRequestType.SEARCH,
            value: ProductRequestType.SEARCH,
            limitationType: LimitationType.SEARCH,
            label: 'Search Items',
            previewLabel: 'Preview Search Label',
          },
        ])
      ).toEqual(LimitationType.CATEGORY)
      expect(
        getLimitationType(ProductRequestType.SEARCH, [
          {
            id: ProductRequestType.CATALOG,
            value: ProductRequestType.CATALOG,
            limitationType: LimitationType.CATEGORY,
            label: 'Catalog product view',
            previewLabel: 'Preview Catalog Label',
          },
          {
            id: ProductRequestType.SEARCH,
            value: ProductRequestType.SEARCH,
            limitationType: LimitationType.SEARCH,
            label: 'Search Items',
            previewLabel: 'Preview Search Label',
          },
        ])
      ).toEqual(LimitationType.SEARCH)
      expect(
        getLimitationType('fake_request_type', [
          {
            id: ProductRequestType.CATALOG,
            value: ProductRequestType.CATALOG,
            limitationType: LimitationType.CATEGORY,
            label: 'Catalog product view',
            previewLabel: 'Preview Catalog Label',
          },
          {
            id: ProductRequestType.SEARCH,
            value: ProductRequestType.SEARCH,
            limitationType: LimitationType.SEARCH,
            label: 'Search Items',
            previewLabel: 'Preview Search Label',
          },
        ])
      ).toEqual(undefined)
    })
  })
})
