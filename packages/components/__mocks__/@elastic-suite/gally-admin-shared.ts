import { api } from '@elastic-suite/gally-admin-shared/src/mocks'

import catalog from '@elastic-suite/gally-admin-shared/src/mocks/static/catalog.json'
import categorySortingOptions from '@elastic-suite/gally-admin-shared/src/mocks/static/category_sorting_options.json'
import docs from '@elastic-suite/gally-admin-shared/src/mocks/static/docs.json'
import entrypoint from '@elastic-suite/gally-admin-shared/src/mocks/static/index.json'
import graphql from '@elastic-suite/gally-admin-shared/src/mocks/static/graphql.json'
import metadata from '@elastic-suite/gally-admin-shared/src/mocks/static/metadata.json'
import sourceFieldOptionLabels from '@elastic-suite/gally-admin-shared/src/mocks/static/source_field_option_labels.json'
import ruleEngineGraphqlFilters from '@elastic-suite/gally-admin-shared/src/mocks/static/rule_engine_graphql_filters.json'
import ruleEngineOperators from '@elastic-suite/gally-admin-shared/src/mocks/static/rule_engine_operators.json'

export * from '@elastic-suite/gally-admin-shared/src/constants'
export * from '@elastic-suite/gally-admin-shared/src/contexts'
export * from '@elastic-suite/gally-admin-shared/src/mocks'
export * from '@elastic-suite/gally-admin-shared/src/services/breadcrumb'
export * from '@elastic-suite/gally-admin-shared/src/services/catalog'
export * from '@elastic-suite/gally-admin-shared/src/services/category'
export * from '@elastic-suite/gally-admin-shared/src/services/field'
export * from '@elastic-suite/gally-admin-shared/src/services/format'
export * from '@elastic-suite/gally-admin-shared/src/services/hydra'
export * from '@elastic-suite/gally-admin-shared/src/services/local'
export * from '@elastic-suite/gally-admin-shared/src/services/options'
export * from '@elastic-suite/gally-admin-shared/src/services/network'
export * from '@elastic-suite/gally-admin-shared/src/services/rules'
export * from '@elastic-suite/gally-admin-shared/src/services/style'
export * from '@elastic-suite/gally-admin-shared/src/services/table'
export * from '@elastic-suite/gally-admin-shared/src/services/url'
export * from '@elastic-suite/gally-admin-shared/src/services/user'
export * from '@elastic-suite/gally-admin-shared/src/types'

const body = { hello: 'world' }

/* api */
export const getApiUrl = jest.fn((url) => url)

export const fetchApi = jest.fn()
fetchApi.mockImplementation((_, resource) => {
  let data: unknown = { ...body }
  if (
    (typeof resource !== 'string' &&
      resource.title.toLowerCase() === 'metadata') ||
    (typeof resource === 'string' && resource.endsWith('metadata'))
  ) {
    data = { ...metadata }
  } else if (
    typeof resource === 'string' &&
    resource.endsWith('category_sorting_options')
  ) {
    data = { ...categorySortingOptions }
  } else if (
    (typeof resource !== 'string' &&
      resource.title.toLowerCase() === 'source_field_option_label') ||
    (typeof resource === 'string' &&
      resource.endsWith('source_field_option_labels'))
  ) {
    data = { ...sourceFieldOptionLabels }
  } else if (
    (typeof resource !== 'string' &&
      resource.title.toLowerCase() === 'catalog') ||
    (typeof resource === 'string' && resource.endsWith('catalog'))
  ) {
    data = { ...catalog }
  } else if (
    typeof resource === 'string' &&
    resource.endsWith('rule_engine_graphql_filters')
  ) {
    data = { ...ruleEngineGraphqlFilters }
  } else if (
    typeof resource === 'string' &&
    resource.endsWith('rule_engine_operators')
  ) {
    data = { ...ruleEngineOperators }
  }
  return Promise.resolve(data)
})

export const removeEmptyParameters = jest.fn(
  (searchParameters = {}) => searchParameters
)

export const log = jest.fn((error, log) => log?.(error.message))

export const getApiFilters = jest.fn((x) => x)

/* bundle */

export const isVirtualCategoryEnabled = jest.fn(() => true)

/* fetch */
export const isError = jest.fn((json) => 'error' in json)
export const fetchJson = jest.fn((url) => {
  switch (url) {
    case 'http://localhost/':
      return Promise.resolve({
        json: entrypoint,
        response: {
          headers: new Headers({
            Link: '<http://localhost/docs.jsonld>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"',
          }),
        },
      })
    case 'http://localhost/docs.jsonld':
      return Promise.resolve({
        json: docs,
      })
    case 'http://localhost/graphql':
      return Promise.resolve({
        json: graphql,
      })
    default:
      return Promise.resolve({
        json: body,
        response: { headers: new Headers() },
      })
  }
})

/* form */

export const getFormValidityError = jest.fn(() => 'test')

/* graphql */
export const fetchGraphql = jest.fn(() => {
  const data: unknown = { ...body }
  return Promise.resolve(data)
})

/* parser */
export const parseSchema = jest.fn(() => Promise.resolve(api))

/* storage */
export const storageGet = jest.fn()
export const storageSet = jest.fn()
export const storageRemove = jest.fn()

/* useSchemaLoader */
export const useSchemaLoader = jest.fn(() => ({ data: 'api' }))
