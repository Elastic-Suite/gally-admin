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
import { Metadata } from '../entity/Metadata'
import { AbstractRepository } from './AbstractRepository'

/**
 * Metadata repository.
 */
export class MetadataRepository extends AbstractRepository<Metadata> {
  constructor(client: Client) {
    super(client)
  }

  getEntityCode(): string {
    return Metadata.ENTITY_CODE
  }

  getIdentity(entity: Metadata): string {
    return entity.getEntity()
  }

  protected buildEntityObject(rawEntity: Record<string, any>): Metadata {
    return new Metadata(
      rawEntity['entity'] as string,
      rawEntity['@id'] as string | undefined,
    )
  }
}
