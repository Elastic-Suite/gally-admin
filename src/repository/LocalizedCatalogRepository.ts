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
import { Catalog } from '../entity/Catalog'
import { LocalizedCatalog } from '../entity/LocalizedCatalog'
import { AbstractRepository } from './AbstractRepository'
import { CatalogRepository } from './CatalogRepository'

/**
 * Localized Catalog repository.
 */
export class LocalizedCatalogRepository extends AbstractRepository<LocalizedCatalog> {
  private readonly catalogRepository: CatalogRepository

  constructor(client: Client, catalogRepository: CatalogRepository) {
    super(client)
    this.catalogRepository = catalogRepository
  }

  getEntityCode(): string {
    return LocalizedCatalog.ENTITY_CODE
  }

  getIdentity(entity: LocalizedCatalog): string {
    return entity.getCode()
  }

  protected buildEntityObject(
    rawEntity: Record<string, any>,
  ): LocalizedCatalog {
    // catalogRepository.findByUri is async, but buildEntityObject is sync in the
    // abstract class. We store a placeholder and resolve later.
    // For consistency, we use a sync approach: the catalog should already be cached.
    const catalogUri = rawEntity['catalog'] as string
    let catalog: Catalog | undefined

    // Try to find it in the catalog repository cache
    const cachedCatalog = this.catalogRepository['entityByUri'].get(catalogUri)
    if (cachedCatalog) {
      catalog = cachedCatalog
    } else {
      // Placeholder - will be resolved when needed
      catalog = new Catalog('unknown', 'unknown', catalogUri)
    }

    return new LocalizedCatalog(
      catalog,
      rawEntity['code'] as string,
      rawEntity['name'] as string,
      rawEntity['locale'] as string,
      rawEntity['currency'] as string,
      rawEntity['@id'] as string | undefined,
    )
  }

  /**
   * Override findByUri to handle async catalog resolution.
   */
  override async findByUri(uri: string): Promise<LocalizedCatalog> {
    const cached = this.entityByUri.get(uri)
    if (cached) {
      return cached
    }

    const rawEntity = await this.client.get(uri)
    const catalog = await this.catalogRepository.findByUri(
      rawEntity['catalog'] as string,
    )

    const entity = new LocalizedCatalog(
      catalog,
      rawEntity['code'] as string,
      rawEntity['name'] as string,
      rawEntity['locale'] as string,
      rawEntity['currency'] as string,
      rawEntity['@id'] as string | undefined,
    )

    this.saveInCache(entity)
    return entity
  }

  /**
   * Override findBy to handle async catalog resolution.
   */
  override async findBy(
    criteria: Record<string, any> = {},
    saveInCache = false,
  ): Promise<Map<string, LocalizedCatalog>> {
    let currentPage = 1
    const entities = new Map<string, LocalizedCatalog>()

    let rawEntitiesArray: any[]
    do {
      const rawEntities = await this.client.get(this.getEntityCode(), {
        ...criteria,
        currentPage,
        pageSize: AbstractRepository.FETCH_PAGE_SIZE,
      })

      rawEntitiesArray = (rawEntities['hydra:member'] as any[]) ?? []
      for (const rawEntity of rawEntitiesArray) {
        const catalog = await this.catalogRepository.findByUri(
          rawEntity['catalog'] as string,
        )
        const entity = new LocalizedCatalog(
          catalog,
          rawEntity['code'] as string,
          rawEntity['name'] as string,
          rawEntity['locale'] as string,
          rawEntity['currency'] as string,
          rawEntity['@id'] as string | undefined,
        )
        entities.set(this.getIdentity(entity), entity)
        if (saveInCache) {
          this.saveInCache(entity)
        }
      }
      currentPage++
    } while (rawEntitiesArray.length >= AbstractRepository.FETCH_PAGE_SIZE)

    return entities
  }
}
