import { VariableType, jsonToGraphQLQuery } from 'json-to-graphql-query'

import { IGraphqlQueryContent, IProductFieldFilterInput } from '../types'
import { IDocumentFieldFilterInput } from '../types/documents'

export function getSearchProductsQuery(
  filter: IProductFieldFilterInput | IProductFieldFilterInput[] = null,
  withAggregations = false
): string {
  const productQueryContent = getSearchProductsQueryContent(
    filter,
    withAggregations
  )
  return jsonToGraphQLQuery({
    query: {
      __name: 'getProducts',
      __variables: { ...productQueryContent.variables },
      products: {
        __aliasFor: 'products',
        __args: { ...productQueryContent.args },
        ...productQueryContent.fields,
      },
    },
  })
}

function getSearchProductsQueryContent(
  filter: IProductFieldFilterInput | IProductFieldFilterInput[] = null,
  withAggregations = false
): IGraphqlQueryContent {
  return {
    variables: {
      requestType: 'ProductRequestTypeEnum!',
      localizedCatalog: 'String!',
      currentPage: 'Int',
      currentCategoryId: 'String',
      pageSize: 'Int',
      search: 'String',
      sort: 'ProductSortInput',
    },
    args: {
      requestType: new VariableType('requestType'),
      localizedCatalog: new VariableType('localizedCatalog'),
      currentPage: new VariableType('currentPage'),
      currentCategoryId: new VariableType('currentCategoryId'),
      pageSize: new VariableType('pageSize'),
      search: new VariableType('search'),
      sort: new VariableType('sort'),
      filter,
    },
    fields: {
      collection: {
        __on: {
          __typeName: 'Product',
          id: true,
          sku: true,
          name: true,
          score: true,
          image: true,

          stock: {
            status: true,
          },
          price: {
            price: true,
          },
        },
      },
      paginationInfo: {
        lastPage: true,
        itemsPerPage: true,
        totalCount: true,
      },
      sortInfo: {
        current: {
          field: true,
          direction: true,
        },
      },
      ...(withAggregations && {
        aggregations: {
          field: true,
          label: true,
          type: true,
          options: {
            count: true,
            label: true,
            value: true,
          },
          hasMore: true,
        },
      }),
    },
  }
}

export function getSearchCategoryQueryContent(
  filter: IDocumentFieldFilterInput | IDocumentFieldFilterInput[] = null,
  withAggregations = false
): IGraphqlQueryContent {
  return getSearchDocumentQueryContent(filter, withAggregations, 'category')
}

export function getSearchDocumentQueryContent(
  filter: IDocumentFieldFilterInput | IDocumentFieldFilterInput[] = null,
  withAggregations = false,
  variablePrefix = 'document'
): IGraphqlQueryContent {
  return {
    variables: {
      [`${variablePrefix}EntityType`]: 'String!',
      [`${variablePrefix}LocalizedCatalog`]: 'String!',
      [`${variablePrefix}CurrentPage`]: 'Int',
      [`${variablePrefix}PageSize`]: 'Int',
      [`${variablePrefix}Search`]: 'String',
      [`${variablePrefix}Sort`]: 'SortInput',
    },
    args: {
      entityType: new VariableType(`${variablePrefix}EntityType`),
      localizedCatalog: new VariableType(`${variablePrefix}LocalizedCatalog`),
      currentPage: new VariableType(`${variablePrefix}CurrentPage`),
      pageSize: new VariableType(`${variablePrefix}PageSize`),
      search: new VariableType(`${variablePrefix}Search`),
      sort: new VariableType(`${variablePrefix}Sort`),
      filter,
    },
    fields: {
      collection: {
        __on: {
          __typeName: 'Document',
          id: true,
          score: true,
          source: true,
        },
      },
      paginationInfo: {
        lastPage: true,
        itemsPerPage: true,
        totalCount: true,
      },
      sortInfo: {
        current: {
          field: true,
          direction: true,
        },
      },
      ...(withAggregations && {
        aggregations: {
          field: true,
          label: true,
          type: true,
          options: {
            count: true,
            label: true,
            value: true,
          },
          hasMore: true,
        },
      }),
    },
  }
}

export function getAutoCompleteSearchQuery(
  filter: IProductFieldFilterInput | IProductFieldFilterInput[] = null,
  withAggregations = false
): string {
  const productQueryContent = getSearchProductsQueryContent(
    filter,
    withAggregations
  )
  const categoryQueryContent = getSearchCategoryQueryContent(
    filter,
    withAggregations
  )
  return jsonToGraphQLQuery({
    query: {
      __name: 'getAutoCompleteDocuments',
      __variables: {
        ...productQueryContent.variables,
        ...categoryQueryContent.variables,
      },
      products: {
        __aliasFor: 'products',
        __args: { ...productQueryContent.args },
        ...productQueryContent.fields,
      },
      categories: {
        __aliasFor: 'documents',
        __args: { ...categoryQueryContent.args },
        ...categoryQueryContent.fields,
      },
    },
  })
}

export function getMoreFacetOptionsQuery(
  filter: IProductFieldFilterInput | IProductFieldFilterInput[] = null
): string {
  return jsonToGraphQLQuery({
    query: {
      __name: 'viewMoreProductFacetOptions',
      __variables: {
        localizedCatalog: 'String!',
        aggregation: 'String!',
        currentCategoryId: 'String',
        search: 'String',
      },
      viewMoreProductFacetOptions: {
        __args: {
          localizedCatalog: new VariableType('localizedCatalog'),
          aggregation: new VariableType('aggregation'),
          currentCategoryId: new VariableType('currentCategoryId'),
          search: new VariableType('search'),
          filter,
        },
        id: true,
        value: true,
        label: true,
        count: true,
      },
    },
  })
}

export const getProductPosition = `query getPosition( $categoryId: String!,  $localizedCatalogId : Int! ) {
  getPositionsCategoryProductMerchandising(categoryId: $categoryId, localizedCatalogId : $localizedCatalogId ) {
    result
  }
}
`

export const savePositions = `mutation savePositionsCategoryProductMerchandising( $categoryId: String!, $savePositionsCategory : String! ){
    savePositionsCategoryProductMerchandising (
      input: {
        categoryId: $categoryId
        positions: $savePositionsCategory
      }
    )
    {categoryProductMerchandising {result}}
}
`
