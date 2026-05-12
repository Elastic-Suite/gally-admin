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
import { AbstractRepository } from './AbstractRepository'

/**
 * Catalog repository.
 */
export class CatalogRepository extends AbstractRepository<Catalog> {
  constructor(client: Client) {
    super(client)
  }

  getEntityCode(): string {
    return Catalog.ENTITY_CODE
  }

  getIdentity(entity: Catalog): string {
    return entity.getCode()
  }

  protected buildEntityObject(rawEntity: Record<string, any>): Catalog {
    return new Catalog(
      rawEntity['code'] as string,
      rawEntity['name'] as string,
      rawEntity['@id'] as string | undefined,
    )
  }
}
