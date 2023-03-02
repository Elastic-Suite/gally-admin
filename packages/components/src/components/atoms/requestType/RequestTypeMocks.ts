export const limitationsTypes = [
  {
    label: 'Product catalog',
    labelIsAll: 'All Products catalogs',
    value: 'category',
  },
  {
    label: 'Search terms',
    labelIsAll: 'All Search terms',
    value: 'search',
  },
]

export const requestTypesOptions = [
  {
    label: 'Product catalog',
    limitation_type: 'category',
    id: 'product_catalog',
    value: 'product_catalog',
  },
  {
    label: 'Search terms',
    limitation_type: 'search',
    id: 'product_search',
    value: 'product_search',
  },
]

export const textOperatorOptions = [
  {
    id: 'eq',
    value: 'eq',
    label: 'is',
  },
  {
    id: '%like',
    value: '%like',
    label: 'starts with',
  },
  {
    id: '%like%',
    value: '%like%',
    label: 'contains',
  },
  {
    id: 'like%',
    value: 'like%',
    label: 'ends with',
  },
]

export const dataGeneralBoost = [
  {
    '@id': '/boosts/1',
    '@type': 'Boost',
    id: 1,
    name: 'My First Boost',
    isActive: true,
    model: 'constant_score',
    modelConfig:
      '{"scale_factor":"1","constant_score_value":"23","scale_function":""}',
    localizedCatalogs: ['/localized_catalogs/19', '/localized_catalogs/20'],
    requestTypes: [
      {
        '@id': '/boost_request_types/1',
        '@type': 'BoostRequestType',
        requestType: 'product_search',
        applyToAll: false,
      },
    ],
    categoryLimitations: [
      {
        '@id': '/boost_category_limitations/1',
        '@type': 'BoostCategoryLimitation',
        category: '/categories/cat_2',
      },
    ],
    searchLimitations: [
      {
        '@id': '/boost_search_limitations/1',
        '@type': 'BoostSearchLimitation',
        operator: 'eq',
        queryText: 'EQ',
      },
      {
        '@id': '/boost_search_limitations/2',
        '@type': 'BoostSearchLimitation',
        operator: 'eq',
        queryText: 'eq again',
      },
      {
        '@id': '/boost_search_limitations/3',
        '@type': 'BoostSearchLimitation',
        operator: '%like',
        queryText: '%like',
      },
      {
        '@id': '/boost_search_limitations/1',
        '@type': 'BoostSearchLimitation',
        operator: '%like%',
        queryText: '%like%',
      },
      {
        '@id': '/boost_search_limitations/1',
        '@type': 'BoostSearchLimitation',
        operator: 'like%',
        queryText: 'like%',
      },
    ],
    createdAt: '2023-03-01T10:42:15+00:00',
    updatedAt: '2023-03-01T10:42:15+00:00',
  },
][
  {
    eq: ['queryTExt'],
  }
]
