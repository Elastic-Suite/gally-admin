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

import { Client } from '../client/Client'
import {
  Configuration,
  IBrowserConfigurationOptions,
} from '../client/Configuration'
import { ITokenCacheManager } from '../client/TokenCacheManager'
import { Metadata } from '../entity/Metadata'
import { SourceField } from '../entity/SourceField'
import { IRequestOptions, Request } from '../graphql/Request'
import { Response } from '../graphql/Response'
import { MetadataRepository } from '../repository/MetadataRepository'
import { SourceFieldRepository } from '../repository/SourceFieldRepository'

type SearchConfiguration = Configuration | IBrowserConfigurationOptions
type SearchRequestMetadata = string | Metadata
type SearchRequestOptions = Omit<IRequestOptions, 'metadata'> & {
  metadata: SearchRequestMetadata
}
type SearchRequest = Request | SearchRequestOptions

/**
 * Search manager service.
 */
export class SearchManager {
  static readonly TERM_SUGGESTION_BUNDLE_NAME = 'GallyTermSuggestionBundle'

  protected readonly configuration: Configuration
  protected readonly client: Client
  // One entry per localized catalog code ('' when none is given): the labels are localized.
  protected productSortingOptions = new Map<string, Promise<SourceField[]>>()
  protected readonly sourceFieldRepository: SourceFieldRepository

  constructor(
    configuration: SearchConfiguration,
    tokenCacheManager?: ITokenCacheManager
  ) {
    this.configuration = this.normalizeConfiguration(configuration)
    const client = new Client(this.configuration, tokenCacheManager)
    this.client = client
    this.sourceFieldRepository = new SourceFieldRepository(
      client,
      new MetadataRepository(client)
    )
  }

  protected normalizeConfiguration(
    configuration: SearchConfiguration
  ): Configuration {
    return configuration instanceof Configuration
      ? configuration
      : new Configuration(configuration)
  }

  protected normalizeMetadata(metadata: SearchRequestMetadata): Metadata {
    return metadata instanceof Metadata ? metadata : new Metadata(metadata)
  }

  protected normalizeRequest(request: SearchRequest): Request {
    if (request instanceof Request) {
      return request
    }
    return new Request({
      ...request,
      metadata: this.normalizeMetadata(request.metadata),
    })
  }

  /**
   * Sortable product fields. Pass a localized catalog code to get labels in its language.
   */
  getProductSortingOptions(localizedCatalog?: string): Promise<SourceField[]> {
    const key = localizedCatalog ?? ''
    let options = this.productSortingOptions.get(key)
    if (!options) {
      options = this.fetchProductSortingOptions(localizedCatalog)
      this.productSortingOptions.set(key, options)
      // A failed request is not cached, so the next call tries again.
      options.catch(() => this.productSortingOptions.delete(key))
    }

    return options
  }

  protected async fetchProductSortingOptions(
    localizedCatalog?: string
  ): Promise<SourceField[]> {
    const query = `
      query getProductSortingOptions($localizedCatalog: String) {
        productSortingOptions(localizedCatalog: $localizedCatalog) {
          code
          label
          type
        }
      }
    `
    const variables = localizedCatalog ? { localizedCatalog } : {}
    const response = await this.client.graphql(query, variables, {}, false)
    const metadata = new Metadata('product')

    const data = response.data as Record<string, any>
    const options = (data.productSortingOptions as any[]) ?? []

    return options.map(
      (option: any) =>
        new SourceField(
          metadata,
          option.code as string,
          option.type as string,
          option.label as string,
          []
        )
    )
  }

  getFilterableSourceField(
    metadata: SearchRequestMetadata
  ): Promise<Map<string, SourceField>> {
    metadata = this.normalizeMetadata(metadata)
    return this.sourceFieldRepository.findBy({
      'metadata.entity': metadata.getEntity(),
      isFilterable: true,
    })
  }

  getSelectSourceField(
    metadata: SearchRequestMetadata
  ): Promise<Map<string, SourceField>> {
    metadata = this.normalizeMetadata(metadata)
    return this.sourceFieldRepository.findBy({
      'metadata.entity': metadata.getEntity(),
      type: 'select',
    })
  }

  async search(request: SearchRequest): Promise<Response> {
    request = this.normalizeRequest(request)
    const priceGroup = request.getPriceGroupId()
    const withTermSuggestions = this.configuration.hasBundle(
      SearchManager.TERM_SUGGESTION_BUNDLE_NAME
    )
    const response = await this.client.graphql(
      request.buildSearchQuery(withTermSuggestions),
      request.getVariables(),
      priceGroup ? { 'price-group-id': priceGroup } : {},
      false
    )

    return new Response(request, response.data as Record<string, any>)
  }

  async viewMoreProductFilterOption(
    request: SearchRequest,
    aggregationField: string,
    optionSearch?: string
  ): Promise<any[]> {
    request = this.normalizeRequest(request)
    const query = `
      query viewMoreProductFacetOptions (
        $localizedCatalog: String!,
        $search: String,
        $currentCategoryId: String,
        $filter: [ProductFieldFilterInput],
        $aggregation: String!,
        $optionSearch: String,
      ) {
        viewMoreProductFacetOptions (
          localizedCatalog: $localizedCatalog,
          search: $search,
          currentCategoryId: $currentCategoryId,
          filter: $filter,
          aggregation: $aggregation,
          optionSearch: $optionSearch,
        ) {
          value
          label
          count
        }
      }
    `

    const variables = request.getVariables()
    const filteredVariables: Record<string, any> = {
      aggregation: aggregationField,
      localizedCatalog: variables.localizedCatalog,
    }

    if (variables.search) {
      filteredVariables.search = variables.search
    }
    if (variables.filter) {
      filteredVariables.filter = variables.filter
    }
    if (variables.currentCategoryId) {
      filteredVariables.currentCategoryId = variables.currentCategoryId
    }
    if (optionSearch) {
      filteredVariables.optionSearch = optionSearch
    }

    const response = await this.client.graphql(
      query,
      filteredVariables,
      {},
      false
    )

    const data = response.data as Record<string, any>
    return (data.viewMoreProductFacetOptions as any[]) ?? []
  }
}
