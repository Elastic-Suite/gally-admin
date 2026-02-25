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

import { Client } from '../client/Client';
import { Metadata } from '../entity/Metadata';
import { SourceField } from '../entity/SourceField';
import { AbstractBulkRepository } from './AbstractBulkRepository';
import { MetadataRepository } from './MetadataRepository';

/**
 * Source field repository.
 */
export class SourceFieldRepository extends AbstractBulkRepository<SourceField> {
  private readonly metadataRepository: MetadataRepository;

  constructor(client: Client, metadataRepository: MetadataRepository) {
    super(client);
    this.metadataRepository = metadataRepository;
  }

  getEntityCode(): string {
    return SourceField.ENTITY_CODE;
  }

  getIdentity(entity: SourceField): string {
    return `${entity.getMetadata().getEntity()}_${entity.getCode()}`;
  }

  protected buildEntityObject(rawEntity: Record<string, any>): SourceField {
    // Try to get metadata from cache
    const metadataUri = rawEntity['metadata'] as string;
    let metadata: Metadata | undefined;

    const cachedMetadata =
      this.metadataRepository['entityByUri'].get(metadataUri);
    if (cachedMetadata) {
      metadata = cachedMetadata;
    } else {
      metadata = new Metadata('unknown', metadataUri);
    }

    return new SourceField(
      metadata,
      rawEntity['code'] as string,
      rawEntity['type'] as string,
      rawEntity['defaultLabel'] as string,
      rawEntity['labels'] ?? [],
      (rawEntity['isSystem'] as boolean) ?? false,
      rawEntity['@id'] as string | undefined,
    );
  }

  /**
   * Override findByUri to handle async metadata resolution.
   */
  override async findByUri(uri: string): Promise<SourceField> {
    const cached = this.entityByUri.get(uri);
    if (cached) {
      return cached;
    }

    const rawEntity = await this.client.get(uri);
    const metadata = await this.metadataRepository.findByUri(
      rawEntity['metadata'] as string,
    );

    const entity = new SourceField(
      metadata,
      rawEntity['code'] as string,
      rawEntity['type'] as string,
      rawEntity['defaultLabel'] as string,
      rawEntity['labels'] ?? [],
      (rawEntity['isSystem'] as boolean) ?? false,
      rawEntity['@id'] as string | undefined,
    );

    this.saveInCache(entity);
    return entity;
  }

  /**
   * Override findBy to handle async metadata resolution.
   */
  override async findBy(
    criteria: Record<string, any> = {},
    saveInCache = false,
  ): Promise<Map<string, SourceField>> {
    let currentPage = 1;
    const entities = new Map<string, SourceField>();

    let rawEntitiesArray: any[];
    do {
      const rawEntities = await this.client.get(this.getEntityCode(), {
        ...criteria,
        currentPage,
        pageSize: AbstractBulkRepository.FETCH_PAGE_SIZE,
      });

      rawEntitiesArray = (rawEntities['hydra:member'] as any[]) ?? [];
      for (const rawEntity of rawEntitiesArray) {
        const metadata = await this.metadataRepository.findByUri(
          rawEntity['metadata'] as string,
        );
        const entity = new SourceField(
          metadata,
          rawEntity['code'] as string,
          rawEntity['type'] as string,
          rawEntity['defaultLabel'] as string,
          rawEntity['labels'] ?? [],
          (rawEntity['isSystem'] as boolean) ?? false,
          rawEntity['@id'] as string | undefined,
        );
        entities.set(this.getIdentity(entity), entity);
        if (saveInCache) {
          this.saveInCache(entity);
        }
      }
      currentPage++;
    } while (rawEntitiesArray.length >= AbstractBulkRepository.FETCH_PAGE_SIZE);

    return entities;
  }
}
