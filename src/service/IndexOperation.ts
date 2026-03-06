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
import { Configuration } from '../client/Configuration'
import { TokenCacheManager } from '../client/TokenCacheManager'
import { Index } from '../entity/GallyIndex'
import { LocalizedCatalog } from '../entity/LocalizedCatalog'
import { Metadata } from '../entity/Metadata'
import { CatalogRepository } from '../repository/CatalogRepository'
import { LocalizedCatalogRepository } from '../repository/LocalizedCatalogRepository'

/**
 * Index operation service.
 */
export class IndexOperation {
  private static readonly INDEX_DOCUMENT_ENTITY_CODE = 'index_documents'

  protected readonly client: Client
  protected readonly localizedCatalogRepository: LocalizedCatalogRepository

  constructor(
    configuration: Configuration,
    tokenCacheManager?: TokenCacheManager,
  ) {
    this.client = new Client(configuration, tokenCacheManager)
    const catalogRepository = new CatalogRepository(this.client)
    this.localizedCatalogRepository = new LocalizedCatalogRepository(
      this.client,
      catalogRepository,
    )
  }

  async createIndex(
    metadata: Metadata,
    localizedCatalog: LocalizedCatalog,
  ): Promise<Index> {
    const index = new Index(metadata, localizedCatalog)

    const indexRawData = await this.client.post(
      Index.ENTITY_CODE,
      index.toJson(),
    )
    index.setName(indexRawData['name'] as string)

    return index
  }

  async getIndexByName(
    metadata: Metadata,
    localizedCatalog: LocalizedCatalog,
  ): Promise<Index> {
    const rawIndicesList = await this.client.get(Index.ENTITY_CODE)

    if (!localizedCatalog.getUri()) {
      const existingLocalizedCatalogs =
        await this.localizedCatalogRepository.findBy({
          code: localizedCatalog.getCode(),
        })
      if (existingLocalizedCatalogs.size !== 1) {
        throw new Error(
          `Can't find localized catalog with code '${localizedCatalog.getCode()}', make sure your catalog structure has been synced with Gally.`,
        )
      }
      const firstEntry = existingLocalizedCatalogs.values().next().value
      if (firstEntry) {
        localizedCatalog.setUri(firstEntry.getUri())
      }
    }

    const members = (rawIndicesList['hydra:member'] as any[]) ?? []
    for (const rawIndex of members) {
      if (
        rawIndex['entityType'] === metadata.getEntity() &&
        rawIndex['localizedCatalog'] === localizedCatalog.getUri() &&
        rawIndex['status'] === 'live'
      ) {
        const index = new Index(metadata, localizedCatalog)
        index.setName(rawIndex['name'] as string)
        return index
      }
    }

    throw new Error(
      `Index for entity ${metadata.getEntity()} and localizedCatalog ${localizedCatalog.getCode()} does not exist yet. Make sure everything is reindexed.`,
    )
  }

  async refreshIndex(index: Index | string): Promise<void> {
    const indexName = typeof index === 'string' ? index : index.getName()
    await this.client.put(`${Index.ENTITY_CODE}/refresh/${indexName}`)
  }

  async installIndex(index: Index | string): Promise<void> {
    const indexName = typeof index === 'string' ? index : index.getName()
    await this.client.put(`${Index.ENTITY_CODE}/install/${indexName}`)
  }

  async executeBulk(
    index: Index | string,
    documents: Record<string, any>[],
  ): Promise<void> {
    const indexName = typeof index === 'string' ? index : index.getName()
    await this.client.post(IndexOperation.INDEX_DOCUMENT_ENTITY_CODE, {
      indexName,
      documents: documents.map((doc) => JSON.stringify(doc)),
    })
  }

  async deleteBulk(
    index: Index | string,
    documentIds: (string | number)[],
  ): Promise<void> {
    const indexName = typeof index === 'string' ? index : index.getName()
    const stringIds = documentIds.map(String)

    await this.client.delete(
      `${IndexOperation.INDEX_DOCUMENT_ENTITY_CODE}/${indexName}`,
      { document_ids: stringIds },
    )
  }
}
