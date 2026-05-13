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

export {
  Request,
  FilterOperator,
  FilterType,
  SortDirection,
  SORT_RELEVANCE_FIELD,
  getFilterTypeByOperator,
} from './Request'
export type {
  IRequestOptions as RequestOptions,
  FilterOperatorType,
  FilterTypeType,
  SortDirectionType,
} from './Request'
export { Response, ResponseFilterType } from './Response'
export type {
  IAggregation as Aggregation,
  IAggregationOption as AggregationOption,
  IPaginationInfo as PaginationInfo,
  ISortInfo as SortInfo,
} from './Response'
