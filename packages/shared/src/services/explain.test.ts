import {
  cleanExplainGraphQLVariables,
  isGraphQLValidVariables,
} from './explain'
import { LimitationType } from '../types'

describe('Explain service', () => {
  describe('isValidVariables', () => {
    it('Should test if explain GraphQL variables are valid with limitationType "search"', () => {
      expect(
        isGraphQLValidVariables(
          {
            requestType: 'product_catalog',
            search: 'bag',
            localizedCatalog: '1',
            category: {
              id: 'cat_7',
              name: 'Bag',
              level: 2,
              isVirtual: false,
              path: 'cat_2/cat_8',
            },
          },
          LimitationType.SEARCH
        )
      ).toEqual(true)
      expect(
        isGraphQLValidVariables(
          {
            requestType: 'product_catalog',
            search: 'bag',
            localizedCatalog: '1',
          },
          LimitationType.SEARCH
        )
      ).toEqual(true)
      expect(
        isGraphQLValidVariables(
          {
            requestType: '',
            search: 'bag',
            localizedCatalog: '1',
          },
          LimitationType.SEARCH
        )
      ).toEqual(false)
      expect(
        isGraphQLValidVariables(
          {
            requestType: 'product_catalog',
            search: '',
            localizedCatalog: '1',
          },
          LimitationType.SEARCH
        )
      ).toEqual(false)
      expect(
        isGraphQLValidVariables(
          {
            requestType: 'product_catalog',
            search: 'bag',
            localizedCatalog: '',
          },
          LimitationType.SEARCH
        )
      ).toEqual(false)
      expect(
        isGraphQLValidVariables(
          {
            requestType: undefined,
            search: 'bag',
            localizedCatalog: '1',
          },
          LimitationType.SEARCH
        )
      ).toEqual(false)
      expect(
        isGraphQLValidVariables(
          {
            requestType: 'product_catalog',
            search: undefined,
            localizedCatalog: '1',
          },
          LimitationType.SEARCH
        )
      ).toEqual(false)
      expect(
        isGraphQLValidVariables(
          {
            requestType: 'product_catalog',
            search: 'bag',
            localizedCatalog: undefined,
          },
          LimitationType.SEARCH
        )
      ).toEqual(false)
    })
    it('Should test if explain GraphQL variables are valid with limitationType "category"', () => {
      expect(
        isGraphQLValidVariables(
          {
            requestType: 'product_catalog',
            search: 'bag',
            localizedCatalog: '1',
            category: {
              id: 'cat_7',
              name: 'Bag',
              level: 2,
              isVirtual: false,
              path: 'cat_2/cat_8',
            },
          },
          LimitationType.CATEGORY
        )
      ).toEqual(true)
      expect(
        isGraphQLValidVariables(
          {
            requestType: 'product_catalog',
            localizedCatalog: '1',
            category: {
              id: 'cat_7',
              name: 'Bag',
              level: 2,
              isVirtual: false,
              path: 'cat_2/cat_8',
            },
          },
          LimitationType.CATEGORY
        )
      ).toEqual(true)
      expect(
        isGraphQLValidVariables(
          {
            requestType: '',
            localizedCatalog: '1',
            category: undefined,
          },
          LimitationType.CATEGORY
        )
      ).toEqual(false)
    })
  })

  describe('cleanExplainGraphQLVariables', () => {
    it('Should clean explain GraphQL variables', () => {
      expect(
        cleanExplainGraphQLVariables(
          {
            requestType: 'product_catalog',
            search: 'bag',
            localizedCatalog: '1',
            category: {
              id: 'cat_7',
              name: 'Bag',
              level: 2,
              isVirtual: false,
              path: 'cat_2/cat_8',
            },
          },
          LimitationType.CATEGORY
        )
      ).toEqual({
        requestType: 'product_catalog',
        localizedCatalog: '1',
        category: {
          id: 'cat_7',
          name: 'Bag',
          level: 2,
          isVirtual: false,
          path: 'cat_2/cat_8',
        },
      })
      expect(
        cleanExplainGraphQLVariables(
          {
            requestType: 'product_catalog',
            search: 'bag',
            localizedCatalog: '1',
            category: {
              id: 'cat_7',
              name: 'Bag',
              level: 2,
              isVirtual: false,
              path: 'cat_2/cat_8',
            },
          },
          LimitationType.SEARCH
        )
      ).toEqual({
        requestType: 'product_catalog',
        search: 'bag',
        localizedCatalog: '1',
      })
    })
  })
})
