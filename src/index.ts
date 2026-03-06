/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2024-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

// Client
export { Client, Configuration } from './client'
export type {
  HttpMethod,
  ConfigurationOptions,
  TokenCacheManager,
} from './client'

// Entities
export {
  AbstractEntity,
  Catalog,
  Index,
  Label,
  LocalizedCatalog,
  Metadata,
  SourceField,
  SourceFieldType,
  SourceFieldOption,
} from './entity'

// GraphQL
export {
  Request,
  Response,
  FilterOperator,
  FilterType,
  SortDirection,
  SORT_RELEVANCE_FIELD,
  ResponseFilterType,
  getFilterTypeByOperator,
} from './graphql'
export type {
  RequestOptions,
  FilterOperatorType,
  FilterTypeType,
  SortDirectionType,
  Aggregation,
  AggregationOption,
  PaginationInfo,
  SortInfo,
} from './graphql'

// Repositories
export {
  AbstractRepository,
  AbstractBulkRepository,
  CatalogRepository,
  LocalizedCatalogRepository,
  MetadataRepository,
  SourceFieldRepository,
  SourceFieldOptionRepository,
} from './repository'

// Services
export { IndexOperation, SearchManager, StructureSynchronizer } from './service'

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  console.warn(
    'You are importing the full @gally/sdk in a browser environment. ' +
    'Consider using @gally/sdk/browser instead to reduce bundle size and prevent errors.'
  )
}
