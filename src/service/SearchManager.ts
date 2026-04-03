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
  BrowserConfigurationOptions,
  Configuration,
} from '../client/Configuration'
import { TokenCacheManager } from '../client/TokenCacheManager'
import { Metadata } from '../entity/Metadata'
import { SourceField } from '../entity/SourceField'
import { Request, RequestOptions } from '../graphql/Request'
import { Response } from '../graphql/Response'
import { MetadataRepository } from '../repository/MetadataRepository'
import { SourceFieldRepository } from '../repository/SourceFieldRepository'

type SearchConfiguration = Configuration | BrowserConfigurationOptions
type SearchRequestMetadata = string | Metadata
type SearchRequestOptions = Omit<RequestOptions, 'metadata'> & {
  metadata: SearchRequestMetadata
}
type SearchRequest = Request | SearchRequestOptions

/**
 * Search manager service.
 */
export class SearchManager {
  protected readonly client: Client
  protected productSortingOptions?: SourceField[]
  protected readonly sourceFieldRepository: SourceFieldRepository

  constructor(
    configuration: SearchConfiguration,
    tokenCacheManager?: TokenCacheManager,
  ) {
    configuration = this.normalizeConfiguration(configuration)
    const client = new Client(configuration, tokenCacheManager)
    this.client = client
    this.sourceFieldRepository = new SourceFieldRepository(
      client,
      new MetadataRepository(client),
    )
  }

  normalizeConfiguration(configuration: SearchConfiguration): Configuration {
    return configuration instanceof Configuration
      ? configuration
      : new Configuration(configuration)
  }

  normalizeMetadata(metadata: SearchRequestMetadata): Metadata {
    return metadata instanceof Metadata ? metadata : new Metadata(metadata)
  }

  normalizeRequest(request: SearchRequest): Request {
    if (request instanceof Request) {
      return request
    }
    return new Request({
      ...request,
      metadata: this.normalizeMetadata(request.metadata),
    })
  }

  async getProductSortingOptions(): Promise<SourceField[]> {
    if (!this.productSortingOptions) {
      const query = `
        {
          productSortingOptions {
            code
            label
            type
          }
        }
      `
      const response = await this.client.graphql(query, {}, {}, false)
      const metadata = new Metadata('product')

      const data = response['data'] as Record<string, any>
      const options = (data['productSortingOptions'] as any[]) ?? []

      this.productSortingOptions = options.map(
        (option: any) =>
          new SourceField(
            metadata,
            option['code'] as string,
            option['type'] as string,
            option['label'] as string,
            [],
          ),
      )
    }

    return this.productSortingOptions
  }

  async getFilterableSourceField(
    metadata: SearchRequestMetadata,
  ): Promise<Map<string, SourceField>> {
    metadata = this.normalizeMetadata(metadata)
    return this.sourceFieldRepository.findBy({
      'metadata.entity': metadata.getEntity(),
      isFilterable: true,
    })
  }

  async getSelectSourceField(
    metadata: SearchRequestMetadata,
  ): Promise<Map<string, SourceField>> {
    metadata = this.normalizeMetadata(metadata)
    return this.sourceFieldRepository.findBy({
      'metadata.entity': metadata.getEntity(),
      type: SourceField.ENTITY_CODE === 'source_fields' ? 'select' : 'select',
    })
  }

  async search(request: SearchRequest): Promise<Response> {
    request = this.normalizeRequest(request)
    const priceGroup = request.getPriceGroupId()
    const response = await this.client.graphql(
      request.buildSearchQuery(),
      request.getVariables(),
      priceGroup ? { 'price-group-id': priceGroup } : {},
      false,
    )

    return new Response(request, response['data'] as Record<string, any>)
  }

  async viewMoreProductFilterOption(
    request: SearchRequest,
    aggregationField: string,
  ): Promise<any[]> {
    request = this.normalizeRequest(request)
    const query = `
      query viewMoreProductFacetOptions (
        $localizedCatalog: String!,
        $search: String,
        $currentCategoryId: String,
        $filter: [ProductFieldFilterInput],
        $aggregation: String!,
      ) {
        viewMoreProductFacetOptions (
          localizedCatalog: $localizedCatalog,
          search: $search,
          currentCategoryId: $currentCategoryId,
          filter: $filter,
          aggregation: $aggregation,
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
      localizedCatalog: variables['localizedCatalog'],
    }

    if (variables['search']) {
      filteredVariables['search'] = variables['search']
    }
    if (variables['filter']) {
      filteredVariables['filter'] = variables['filter']
    }
    if (variables['currentCategoryId']) {
      filteredVariables['currentCategoryId'] = variables['currentCategoryId']
    }

    const response = await this.client.graphql(
      query,
      filteredVariables,
      {},
      false,
    )

    const data = response['data'] as Record<string, any>
    return (data['viewMoreProductFacetOptions'] as any[]) ?? []
  }
}
