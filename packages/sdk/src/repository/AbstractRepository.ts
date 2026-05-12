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

import { Client } from '../client'
import { AbstractEntity } from '../entity'

/**
 * Abstract entity repository.
 */
export abstract class AbstractRepository<T extends AbstractEntity> {
  protected static readonly FETCH_PAGE_SIZE = 50

  protected entityByIdentity: Map<string, T> = new Map()
  protected entityByUri: Map<string, T> = new Map()

  constructor(protected readonly client: Client) {}

  abstract getEntityCode(): string

  abstract getIdentity(entity: T): string

  async findByUri(uri: string): Promise<T> {
    const cached = this.entityByUri.get(uri)
    if (cached) {
      return cached
    }

    const rawEntity = await this.client.get(uri)
    const entity = this.buildEntityObject(rawEntity)
    this.saveInCache(entity)

    return entity
  }

  findByIdentity(entity: T): T | undefined {
    const identity = this.getIdentity(entity)
    return this.entityByIdentity.get(identity)
  }

  async findBy(
    criteria: Record<string, any> = {},
    saveInCache = false,
  ): Promise<Map<string, T>> {
    let currentPage = 1
    const entities = new Map<string, T>()

    let rawEntitiesArray: any[]
    do {
      const rawEntities = await this.client.get(this.getEntityCode(), {
        ...criteria,
        currentPage,
        pageSize: AbstractRepository.FETCH_PAGE_SIZE,
      })

      rawEntitiesArray = (rawEntities['hydra:member'] as any[]) ?? []
      for (const rawEntity of rawEntitiesArray) {
        const entity = this.buildEntityObject(rawEntity)
        entities.set(this.getIdentity(entity), entity)
        if (saveInCache) {
          this.saveInCache(entity)
        }
      }
      currentPage++
    } while (rawEntitiesArray.length >= AbstractRepository.FETCH_PAGE_SIZE)

    return entities
  }

  async findAll(): Promise<Map<string, T>> {
    return this.findBy({}, true)
  }

  async createOrUpdate(entity: T): Promise<T> {
    const identity = this.getIdentity(entity)

    const existingEntity = this.entityByIdentity.get(identity)
    const uri = existingEntity ? existingEntity.toString() : entity.toString()

    let result: Record<string, any>
    if (uri) {
      entity.setUri(uri)
      result = await this.client.put(uri, entity.toJson())
    } else {
      result = await this.client.post(this.getEntityCode(), entity.toJson())
    }

    entity.setUri(result['@id'] as string)
    this.saveInCache(entity)

    return entity
  }

  async delete(entity: T): Promise<void> {
    const identity = this.getIdentity(entity)
    const existingEntity = this.entityByIdentity.get(identity)

    if (!existingEntity) {
      throw new Error(`Entity ${identity} not found.`)
    }

    await this.client.delete(existingEntity.toString())
  }

  protected saveInCache(entity: T): void {
    this.entityByIdentity.set(this.getIdentity(entity), entity)
    this.entityByUri.set(entity.toString(), entity)
  }

  protected abstract buildEntityObject(rawEntity: Record<string, any>): T
}
