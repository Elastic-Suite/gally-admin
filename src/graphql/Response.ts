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

import { Request } from './Request'

export const ResponseFilterType = {
  CATEGORY: 'category',
  CHECKBOX: 'checkbox',
  BOOLEAN: 'boolean',
  SLIDER: 'slider',
} as const

export interface AggregationOption {
  count: number
  label: string
  value: string
}

export interface Aggregation {
  type: string
  field: string
  label: string
  count: number
  hasMore: boolean
  options: AggregationOption[]
}

export interface PaginationInfo {
  totalCount: number
  lastPage: number
  itemsPerPage: number
}

export interface SortInfo {
  field: string
  direction: string
}

export class Response {
  private readonly collection: Record<string, any>[]
  private readonly aggregations: Aggregation[]
  private readonly totalCount: number
  private readonly lastPage: number
  private readonly itemsPerPage: number
  private readonly sortField: string
  private readonly sortDirection: string

  constructor(request: Request, rawResponse: Record<string, any>) {
    const endpointData =
      (rawResponse[request.getEndpoint()] as Record<string, any>) ?? {}

    const rawCollection = (endpointData['collection'] ?? []) as Record<
      string,
      any
    >[]
    this.collection = rawCollection.map((item) => {
      if ('data' in item) {
        const source = (item['data'] as Record<string, any>)?.['_source'] as
          | Record<string, any>
          | undefined
        if (source) {
          const selectedFields = request.getSelectedFields()
          const filtered: Record<string, any> = {}
          for (const field of selectedFields) {
            if (field in source) {
              filtered[field] = source[field]
            }
          }
          return filtered
        }
      }
      return item
    })

    this.aggregations = (endpointData['aggregations'] as Aggregation[]) ?? []

    const paginationInfo = endpointData['paginationInfo'] as Record<
      string,
      number
    >
    this.totalCount = paginationInfo['totalCount'] ?? 0
    this.lastPage = paginationInfo['lastPage'] ?? 0
    this.itemsPerPage = paginationInfo['itemsPerPage'] ?? 0

    const sortInfo = endpointData['sortInfo'] as Record<string, any>
    const currentSort = ((sortInfo?.['current'] as Record<string, string>[]) ??
      [])[0]
    this.sortField = currentSort?.['field'] ?? ''
    this.sortDirection = currentSort?.['direction'] ?? ''
  }

  getCollection(): Record<string, any>[] {
    return this.collection
  }

  getAggregations(): Aggregation[] {
    return this.aggregations
  }

  getTotalCount(): number {
    return this.totalCount
  }

  getLastPage(): number {
    return this.lastPage
  }

  getItemsPerPage(): number {
    return this.itemsPerPage
  }

  getSortField(): string {
    return this.sortField
  }

  getSortDirection(): string {
    return this.sortDirection
  }
}
