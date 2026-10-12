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

import { RecommenderType } from '../entity/RecommenderType'
import { AbstractRepository } from './AbstractRepository'

/**
 * Recommender type repository.
 *
 */
export class RecommenderTypeRepository extends AbstractRepository<RecommenderType> {
  getEntityCode(): string {
    return RecommenderType.ENTITY_CODE
  }

  getIdentity(entity: RecommenderType): string {
    return entity.getCode()
  }

  protected buildEntityObject(rawEntity: Record<string, any>): RecommenderType {
    return new RecommenderType(
      rawEntity.name as string,
      rawEntity.code as string,
      rawEntity['@id'] as string | undefined
    )
  }
}
