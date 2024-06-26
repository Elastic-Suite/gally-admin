import { VariableType, jsonToGraphQLQuery } from 'json-to-graphql-query'

import { IGraphqlQueryContent, IProductFieldFilterInput } from '../types'
import { IDocumentFieldFilterInput } from '../types/documents'
import { categoryEntityType } from './category'

export const getPreviewBoost = `query preview($localizedCatalog: String!, $search: String) {
    previewBoost(
      localizedCatalog: $localizedCatalog
      requestType: product_search
      search: $search
    ) {
      id,
      resultsBefore,
      resultsAfter
    }
  }`

export function getPreviewBoostQuery(): string {
  return jsonToGraphQLQuery({
    query: {
      __name: 'getPreview',
      __variables: {
        localizedCatalog: 'String!',
        requestType: 'ProductRequestTypeEnum!',
        currentBoost: 'String!',
        search: 'String',
        category: 'String',
        currentPage: 'Int',
        pageSize: 'Int',
      },
      previewBoost: {
        __args: {
          localizedCatalog: new VariableType('localizedCatalog'),
          requestType: new VariableType('requestType'),
          currentBoost: new VariableType('currentBoost'),
          search: new VariableType('search'),
          currentCategoryId: new VariableType('category'),
          currentPage: new VariableType('currentPage'),
          pageSize: new VariableType('pageSize'),
        },
        id: true,
        resultsBefore: true,
        resultsAfter: true,
        lastPage: true,
        itemsPerPage: true,
        totalItems: true,
      },
    },
  })
}

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

export function getSearchPreviewProductsQuery(
  filter: IProductFieldFilterInput | IProductFieldFilterInput[] = null,
  withAggregations = false
): string {
  const productQueryContent = getSearchProductsQueryContent(
    filter,
    withAggregations
  )
  return jsonToGraphQLQuery({
    query: {
      __name: 'getPreviewProducts',
      __variables: {
        ...productQueryContent.variables,
        currentCategoryConfiguration: 'String',
      },
      products: {
        __aliasFor: 'previewProducts',
        __args: {
          ...productQueryContent.args,
          currentCategoryConfiguration: new VariableType(
            'currentCategoryConfiguration'
          ),
        },
        ...productQueryContent.fields,
      },
    },
  })
}

function getSearchProductsQueryContent(
  filter: IProductFieldFilterInput | IProductFieldFilterInput[] = null,
  withAggregations = false,
  collectionEntityType = 'Product',
  collectionExtraFields = {},
  extraFields = {}
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
          __typeName: collectionEntityType,
          id: true,
          sku: true,
          name: true,
          description: true,
          score: true,
          image: true,

          stock: {
            status: true,
          },
          price: {
            price: true,
          },
          ...collectionExtraFields,
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
          date_format: true,
          date_range_interval: true,
          options: {
            count: true,
            label: true,
            value: true,
          },
          hasMore: true,
        },
      }),
      ...extraFields,
    },
  }
}

export function getSearchCategoryQueryContent(
  filter: IDocumentFieldFilterInput | IDocumentFieldFilterInput[] = null,
  withAggregations = false
): IGraphqlQueryContent {
  return getSearchDocumentQueryContent(
    filter,
    withAggregations,
    categoryEntityType
  )
}

export function getSearchDocumentsQuery(
  entityType: string,
  filter: IDocumentFieldFilterInput | IDocumentFieldFilterInput[] = null,
  withAggregations = false
): string {
  const documentQueryContent = getSearchDocumentQueryContent(
    filter,
    withAggregations,
    entityType
  )
  return jsonToGraphQLQuery({
    query: {
      __name: 'getDocuments',
      __variables: { ...documentQueryContent.variables },
      documents: {
        __aliasFor: 'documents',
        __args: { ...documentQueryContent.args },
        ...documentQueryContent.fields,
      },
    },
  })
}

export function getVectorSearchDocumentsQuery(
  entityType: string,
  filter: IDocumentFieldFilterInput | IDocumentFieldFilterInput[] = null,
  withAggregations = false
): string {
  const documentQueryContent = getSearchDocumentQueryContent(
    filter,
    withAggregations,
    entityType,
    'VectorDocument'
  )

  return jsonToGraphQLQuery({
    query: {
      __name: 'getVectorSearchDocuments',
      __variables: { ...documentQueryContent.variables },
      vectorSearchDocuments: {
        __aliasFor: 'vectorSearchDocuments',
        __args: { ...documentQueryContent.args },
        ...documentQueryContent.fields,
      },
    },
  })
}

export function getSearchDocumentQueryContent(
  filter: IDocumentFieldFilterInput | IDocumentFieldFilterInput[] = null,
  withAggregations = false,
  variablePrefix = 'document',
  collectionEntityType = 'Document'
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
          __typeName: collectionEntityType,
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
          date_format: true,
          date_range_interval: true,
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
  productFilter: IProductFieldFilterInput | IProductFieldFilterInput[] = null,
  categoryFilter:
    | IDocumentFieldFilterInput
    | IDocumentFieldFilterInput[] = null,
  withAggregations = false
): string {
  const productQueryContent = getSearchProductsQueryContent(
    productFilter,
    withAggregations
  )
  const categoryQueryContent = getSearchCategoryQueryContent(
    categoryFilter,
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
  filter: IDocumentFieldFilterInput | IDocumentFieldFilterInput[] = null
): string {
  return jsonToGraphQLQuery({
    query: {
      __name: 'viewMoreFacetOptions',
      __variables: {
        entityType: 'String!',
        localizedCatalog: 'String!',
        aggregation: 'String!',
        search: 'String',
      },
      viewMoreFacetOptions: {
        __args: {
          entityType: new VariableType('entityType'),
          localizedCatalog: new VariableType('localizedCatalog'),
          aggregation: new VariableType('aggregation'),
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

export function getMoreFacetProductOptionsQuery(
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

export function getSearchExplainProductsQuery(
  filter: IProductFieldFilterInput | IProductFieldFilterInput[] = null,
  withAggregations = false
): string {
  const productQueryContent = getSearchProductsQueryContent(
    filter,
    withAggregations,
    'ExplainProduct',
    {
      explanation: true,
      sort: true,
      boosts: true,
      matches: true,
      highlights: true,
      legends: true,
      fieldHighlights: true,
    },
    {
      explainData: {
        elasticSearchQuery: {
          index: true,
          query: true,
        },
        isSpellchecked: true,
        extraData: true,
      },
    }
  )
  return jsonToGraphQLQuery({
    query: {
      __name: 'getExplainProducts',
      __variables: { ...productQueryContent.variables },
      explain: {
        __aliasFor: 'explain',
        __args: { ...productQueryContent.args },
        ...productQueryContent.fields,
      },
    },
  })
}
