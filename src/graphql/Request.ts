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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { LocalizedCatalog } from '../entity/LocalizedCatalog';
import { Metadata } from '../entity/Metadata';

export const FilterOperator = {
  EQ: 'eq',
  IN: 'in',
  MATCH: 'match',
  EXISTS: 'exists',
  LT: 'lt',
  LTE: 'lte',
  GT: 'gt',
  GTE: 'gte',
} as const;

export type FilterOperatorType = (typeof FilterOperator)[keyof typeof FilterOperator];

export const FilterType = {
  BOOLEAN: 'boolFilter',
  EQUAL: 'equalFilter',
  MATCH: 'matchFilter',
  RANGE: 'rangeFilter',
  EXIST: 'existFilter',
} as const;

export type FilterTypeType = (typeof FilterType)[keyof typeof FilterType];

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirectionType = (typeof SortDirection)[keyof typeof SortDirection];

export const SORT_RELEVANCE_FIELD = '_score';

export function getFilterTypeByOperator(operator: string): FilterTypeType {
  switch (operator) {
    case FilterOperator.MATCH:
      return FilterType.MATCH;
    case FilterOperator.LT:
    case FilterOperator.LTE:
    case FilterOperator.GT:
    case FilterOperator.GTE:
      return FilterType.RANGE;
    case FilterOperator.EXISTS:
      return FilterType.EXIST;
    default:
      return FilterType.EQUAL;
  }
}

export interface RequestOptions {
  localizedCatalog: LocalizedCatalog;
  metadata: Metadata;
  isAutocomplete: boolean;
  selectedFields: string[];
  currentPage: number;
  pageSize: number;
  categoryId?: string;
  searchQuery?: string;
  filters: Record<string, any>[];
  sortField?: string;
  sortDirection?: string;
  priceGroupId?: string;
}

export class Request {
  private readonly localizedCatalog: LocalizedCatalog;
  private readonly metadata: Metadata;
  private readonly isAutocomplete: boolean;
  private readonly selectedFields: string[];
  private readonly currentPage: number;
  private readonly pageSize: number;
  private readonly categoryId?: string;
  private readonly searchQuery?: string;
  private readonly filters: Record<string, any>[];
  private readonly sortField?: string;
  private readonly sortDirection?: string;
  private readonly priceGroupId?: string;

  constructor(options: RequestOptions) {
    this.localizedCatalog = options.localizedCatalog;
    this.metadata = options.metadata;
    this.isAutocomplete = options.isAutocomplete;
    this.selectedFields = options.selectedFields;
    this.currentPage = options.currentPage;
    this.pageSize = options.pageSize;
    this.categoryId = options.categoryId;
    this.searchQuery = options.searchQuery;
    this.filters = options.filters;
    this.sortField = options.sortField;
    this.sortDirection = options.sortDirection;
    this.priceGroupId = options.priceGroupId;
  }

  getMetadata(): Metadata {
    return this.metadata;
  }

  getEndpoint(): string {
    return this.metadata.getEntity() === 'product' ? 'products' : 'documents';
  }

  getRequestType(): string | undefined {
    if (this.metadata.getEntity() === 'product') {
      return this.isAutocomplete
        ? 'product_autocomplete'
        : this.searchQuery
          ? 'product_search'
          : 'product_catalog';
    }
    return undefined;
  }

  getLocalizedCatalog(): LocalizedCatalog {
    return this.localizedCatalog;
  }

  getSelectedFields(): string[] {
    return this.selectedFields;
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  getCategoryId(): string | undefined {
    return this.categoryId;
  }

  getSearchQuery(): string | undefined {
    return this.searchQuery;
  }

  getFilters(): Record<string, any>[] {
    return this.filters;
  }

  getSortField(): string | undefined {
    return this.sortField;
  }

  getSortDirection(): string | undefined {
    return this.sortDirection;
  }

  getPriceGroupId(): string | undefined {
    return this.priceGroupId;
  }

  buildSearchQuery(): string {
    const isProductQuery = this.metadata.getEntity() === 'product';
    const hasSelectedFields = this.selectedFields.length > 0;
    const endpoint = this.getEndpoint();
    const entityType = `entityType: "${this.metadata.getEntity()}"`;
    let selectedFieldsList: string[];
    let typePrefix = '';
    let specificVars = '';
    let specificFields = '';

    if (isProductQuery) {
      selectedFieldsList = [...this.getSelectedFields()];
      selectedFieldsList.push('price { price }');
      selectedFieldsList.push('stock { status }');
      typePrefix = 'Product';
      specificVars =
        '$currentCategoryId: String, $requestType: ProductRequestTypeEnum!';
      specificFields =
        'currentCategoryId: $currentCategoryId, requestType: $requestType';
    } else {
      selectedFieldsList = ['id', 'data'];
    }

    const selectedFieldsStr = selectedFieldsList.join(' ');
    const collection = hasSelectedFields
      ? `collection { ${selectedFieldsStr} }`
      : '';

    return `
      query searchQuery (
        $localizedCatalog: String!,
        $currentPage: Int,
        $pageSize: Int,
        $search: String,
        $sort: ${typePrefix}SortInput,
        $filter: [${typePrefix}FieldFilterInput],
        ${specificVars},
      ) {
        ${endpoint} (
          ${isProductQuery ? '' : `${entityType},`}
          localizedCatalog: $localizedCatalog,
          currentPage: $currentPage,
          pageSize: $pageSize,
          search: $search,
          sort: $sort,
          filter: $filter,
          ${specificFields},
        ) {
          ${collection}
          paginationInfo { lastPage itemsPerPage totalCount }
          sortInfo { current { field direction } }
          aggregations {
            type
            field
            label
            count
            hasMore
            options { count label value }
          }
        }
      }
    `;
  }

  getVariables(): Record<string, any> {
    const isProductQuery = this.metadata.getEntity() === 'product';
    const variables: Record<string, any> = {
      requestType: this.getRequestType(),
      localizedCatalog: this.getLocalizedCatalog().getCode(),
      currentCategoryId: this.getCategoryId(),
      search: this.getSearchQuery(),
      currentPage: this.getCurrentPage(),
      pageSize: this.getPageSize(),
      filter: this.getFilters(),
    };

    if (this.sortField) {
      variables['sort'] = isProductQuery
        ? { [this.getSortField()!]: this.getSortDirection() }
        : { field: this.getSortField(), direction: this.getSortDirection() };
    }

    // Filter out undefined/null values
    return Object.fromEntries(
      Object.entries(variables).filter(
        ([, v]) => v !== undefined && v !== null,
      ),
    );
  }
}
