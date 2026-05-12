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
import { SourceField } from '../entity/SourceField'
import { SourceFieldOption } from '../entity/SourceFieldOption'
import { AbstractBulkRepository } from './AbstractBulkRepository'
import { SourceFieldRepository } from './SourceFieldRepository'

/**
 * Source field option repository.
 */
export class SourceFieldOptionRepository extends AbstractBulkRepository<SourceFieldOption> {
  private readonly sourceFieldRepository: SourceFieldRepository

  constructor(client: Client, sourceFieldRepository: SourceFieldRepository) {
    super(client)
    this.sourceFieldRepository = sourceFieldRepository
  }

  getEntityCode(): string {
    return SourceFieldOption.ENTITY_CODE
  }

  getIdentity(entity: SourceFieldOption): string {
    return `${entity.getSourceField().getCode()}_${entity.getCode()}`
  }

  protected buildEntityObject(
    rawEntity: Record<string, any>,
  ): SourceFieldOption {
    const sourceFieldUri = rawEntity['sourceField'] as string
    let sourceField: SourceField | undefined

    const cachedSourceField =
      this.sourceFieldRepository['entityByUri'].get(sourceFieldUri)
    if (cachedSourceField) {
      sourceField = cachedSourceField
    } else {
      sourceField = new SourceField(
        { getEntity: () => 'unknown', toString: () => sourceFieldUri } as any,
        'unknown',
        'text',
        'unknown',
        [],
        false,
        sourceFieldUri,
      )
    }

    return new SourceFieldOption(
      sourceField,
      rawEntity['code'] as string,
      (rawEntity['position'] as number) ?? 0,
      rawEntity['defaultLabel'] as string,
      rawEntity['labels'] ?? [],
      rawEntity['@id'] as string | undefined,
    )
  }

  /**
   * Override findByUri to handle async source field resolution.
   */
  override async findByUri(uri: string): Promise<SourceFieldOption> {
    const cached = this.entityByUri.get(uri)
    if (cached) {
      return cached
    }

    const rawEntity = await this.client.get(uri)
    const sourceField = await this.sourceFieldRepository.findByUri(
      rawEntity['sourceField'] as string,
    )

    const entity = new SourceFieldOption(
      sourceField,
      rawEntity['code'] as string,
      (rawEntity['position'] as number) ?? 0,
      rawEntity['defaultLabel'] as string,
      rawEntity['labels'] ?? [],
      rawEntity['@id'] as string | undefined,
    )

    this.saveInCache(entity)
    return entity
  }
}
