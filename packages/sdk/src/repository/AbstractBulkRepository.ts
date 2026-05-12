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

import { AbstractEntity } from '../entity/AbstractEntity'
import { AbstractRepository } from './AbstractRepository'

/**
 * Abstract bulk entity repository.
 */
export abstract class AbstractBulkRepository<
  T extends AbstractEntity,
> extends AbstractRepository<T> {
  protected static readonly BATCH_SIZE = 100

  private currentBatch: Record<string, any>[] = []
  private currentBatchSize = 0

  addEntityToBulk(entity: T): Promise<void> | void {
    this.currentBatch.push(entity.toJson())
    this.currentBatchSize++
    if (this.currentBatchSize >= AbstractBulkRepository.BATCH_SIZE) {
      return this.runBulk()
    }
  }

  async runBulk(): Promise<void> {
    if (this.currentBatchSize > 0) {
      const rawEntities = await this.client.post(
        `${this.getEntityCode()}/bulk`,
        this.currentBatch,
      )

      const rawEntitiesArray = (rawEntities['hydra:member'] as any[]) ?? []
      for (const rawEntity of rawEntitiesArray) {
        const entity = this.buildEntityObject(rawEntity)
        this.saveInCache(entity)
      }

      this.currentBatch = []
      this.currentBatchSize = 0
    }
  }
}
