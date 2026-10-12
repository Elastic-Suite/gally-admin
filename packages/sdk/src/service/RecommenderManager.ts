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
import { LocalizedCatalog } from '../entity/LocalizedCatalog'

type RecommenderConfiguration = Configuration | IBrowserConfigurationOptions

/**
 * Recommender manager service.
 *
 * Needs the premium Recommender module on the Gally instance.
 */
export class RecommenderManager {
  protected readonly configuration: Configuration
  protected readonly client: Client

  constructor(
    configuration: RecommenderConfiguration,
    tokenCacheManager?: ITokenCacheManager
  ) {
    this.configuration =
      configuration instanceof Configuration
        ? configuration
        : new Configuration(configuration)
    this.client = new Client(this.configuration, tokenCacheManager)
  }

  /**
   * Get the products recommended for the given product SKUs.
   *
   * Returns the raw product data, with `sku` and the requested fields. When productCount is not
   * set, the API returns up to its own maximum (20).
   */
  async getProductRecommendations(
    recommendationType: string,
    localizedCatalog: LocalizedCatalog | string,
    productSkus: string[],
    productCount?: number,
    fields: string[] = []
  ): Promise<any[]> {
    const skus = Array.from(new Set(productSkus.filter(Boolean)))
    if (skus.length === 0) {
      return []
    }

    const variables: Record<string, any> = {
      recommendationType,
      localizedCatalog:
        typeof localizedCatalog === 'string'
          ? localizedCatalog
          : localizedCatalog.getCode(),
      productSkus: skus,
    }
    if (productCount !== undefined) {
      variables.productCount = productCount
    }

    const selectedFields = Array.from(new Set(['sku', ...fields])).join(' ')
    const query = `
      query getProductRecommendations (
        $recommendationType: String!,
        $localizedCatalog: String!,
        $productSkus: [String!]!,
        $productCount: Int,
      ) {
        productRecommendations (
          recommendationType: $recommendationType,
          localizedCatalog: $localizedCatalog,
          productSkus: $productSkus,
          productCount: $productCount,
        ) {
          ${selectedFields}
        }
      }
    `

    const response = await this.client.graphql(query, variables, {}, false)

    const data = response.data as Record<string, any> | undefined
    return (data?.productRecommendations as any[]) ?? []
  }
}
