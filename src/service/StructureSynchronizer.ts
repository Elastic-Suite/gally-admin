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
import { Configuration } from '../client/Configuration';
import { TokenCacheManager } from '../client/TokenCacheManager';
import { AbstractEntity } from '../entity/AbstractEntity';
import { LocalizedCatalog } from '../entity/LocalizedCatalog';
import { Metadata } from '../entity/Metadata';
import { SourceField } from '../entity/SourceField';
import { SourceFieldOption } from '../entity/SourceFieldOption';
import { AbstractRepository } from '../repository/AbstractRepository';
import { CatalogRepository } from '../repository/CatalogRepository';
import { LocalizedCatalogRepository } from '../repository/LocalizedCatalogRepository';
import { MetadataRepository } from '../repository/MetadataRepository';
import { SourceFieldOptionRepository } from '../repository/SourceFieldOptionRepository';
import { SourceFieldRepository } from '../repository/SourceFieldRepository';

/**
 * Synchronize Gally catalogs structure with e-commerce data.
 */
export class StructureSynchronizer {
  private readonly catalogRepository: CatalogRepository;
  private readonly localizedCatalogRepository: LocalizedCatalogRepository;
  private readonly metadataRepository: MetadataRepository;
  private readonly sourceFieldRepository: SourceFieldRepository;
  private readonly sourceFieldOptionRepository: SourceFieldOptionRepository;

  constructor(
    configuration: Configuration,
    tokenCacheManager?: TokenCacheManager,
  ) {
    const client = new Client(configuration, tokenCacheManager);
    this.catalogRepository = new CatalogRepository(client);
    this.localizedCatalogRepository = new LocalizedCatalogRepository(
      client,
      this.catalogRepository,
    );
    this.metadataRepository = new MetadataRepository(client);
    this.sourceFieldRepository = new SourceFieldRepository(
      client,
      this.metadataRepository,
    );
    this.sourceFieldOptionRepository = new SourceFieldOptionRepository(
      client,
      this.sourceFieldRepository,
    );
  }

  /**
   * Sync all localized catalogs.
   */
  async syncAllLocalizedCatalogs(
    localizedCatalogs: Iterable<LocalizedCatalog>,
    clean = false,
    dryRun = true,
  ): Promise<void> {
    const existingCatalogs = new Map(
      await this.catalogRepository.findAll(),
    );
    const existingLocalizedCatalogs = new Map(
      await this.localizedCatalogRepository.findAll(),
    );

    for (const localizedCatalog of localizedCatalogs) {
      await this.syncLocalizedCatalog(localizedCatalog, true);
      existingLocalizedCatalogs.delete(
        this.localizedCatalogRepository.getIdentity(localizedCatalog),
      );
      existingCatalogs.delete(
        this.catalogRepository.getIdentity(localizedCatalog.getCatalog()),
      );
    }

    if (clean) {
      for (const localizedCatalog of existingLocalizedCatalogs.values()) {
        if (!dryRun) {
          await this.localizedCatalogRepository.delete(localizedCatalog);
        }
      }

      for (const catalog of existingCatalogs.values()) {
        if (!dryRun) {
          await this.catalogRepository.delete(catalog);
        }
      }

      console.log(
        `  Delete ${existingLocalizedCatalogs.size} localized catalog(s)`,
      );
      console.log(`  Delete ${existingCatalogs.size} catalog(s)`);
      console.log('');
    }
  }

  /**
   * Sync a single localized catalog.
   */
  async syncLocalizedCatalog(
    localizedCatalog: LocalizedCatalog,
    isFullContext = false,
  ): Promise<LocalizedCatalog> {
    if (!isFullContext) {
      await this.fetchEntityUri(
        localizedCatalog.getCatalog(),
        this.catalogRepository,
        { code: localizedCatalog.getCatalog().getCode() },
      );
      await this.catalogRepository.createOrUpdate(
        localizedCatalog.getCatalog(),
      );

      await this.fetchEntityUri(
        localizedCatalog,
        this.localizedCatalogRepository,
        { code: localizedCatalog.getCode() },
      );
    }

    if (!localizedCatalog.getCatalog().getUri()) {
      await this.catalogRepository.createOrUpdate(
        localizedCatalog.getCatalog(),
      );
    }

    return this.localizedCatalogRepository.createOrUpdate(localizedCatalog);
  }

  /**
   * Sync all source fields.
   */
  async syncAllSourceFields(
    sourceFields: Iterable<SourceField>,
    clean = false,
    dryRun = true,
  ): Promise<void> {
    const existingMetadatas = new Map(
      await this.metadataRepository.findAll(),
    );
    const existingSourceFields = new Map(
      await this.sourceFieldRepository.findAll(),
    );
    await this.localizedCatalogRepository.findAll();

    for (const sourceField of sourceFields) {
      const identity = this.sourceFieldRepository.getIdentity(sourceField);
      const existingSourceField = existingSourceFields.get(identity);
      if (!existingSourceField?.isSystem()) {
        await this.syncSourceField(sourceField, true);
      }
      existingSourceFields.delete(identity);
      existingMetadatas.delete(
        this.metadataRepository.getIdentity(sourceField.getMetadata()),
      );
    }

    await this.sourceFieldRepository.runBulk();

    if (clean) {
      for (const [key, sourceField] of existingSourceFields) {
        if (sourceField.isSystem()) {
          existingSourceFields.delete(key);
          continue;
        }
        if (!dryRun) {
          await this.sourceFieldRepository.delete(sourceField);
        }
      }

      const nonSystemExistingMetadata: Metadata[] = [];
      for (const metadata of existingMetadatas.values()) {
        if (!['product', 'category'].includes(metadata.getEntity())) {
          nonSystemExistingMetadata.push(metadata);
        }
      }

      for (const metadata of nonSystemExistingMetadata) {
        if (!dryRun) {
          await this.metadataRepository.delete(metadata);
        }
      }

      console.log(
        `  Delete ${existingSourceFields.size} source field(s)`,
      );
      console.log(
        `  Delete ${nonSystemExistingMetadata.length} metadata`,
      );
      console.log('');
    }
  }

  /**
   * Sync a single source field.
   */
  async syncSourceField(
    sourceField: SourceField,
    isFullContext = false,
  ): Promise<void> {
    if (!isFullContext) {
      await this.fetchEntityUri(
        sourceField.getMetadata(),
        this.metadataRepository,
        { entity: sourceField.getMetadata().getEntity() },
      );

      await this.fetchEntityUri(
        sourceField,
        this.sourceFieldRepository,
        {
          'metadata.entity': sourceField.getMetadata().getEntity(),
          code: sourceField.getCode(),
        },
      );
    }

    if (!sourceField.getMetadata().getUri()) {
      await this.metadataRepository.createOrUpdate(
        sourceField.getMetadata(),
      );
    }

    // Replace localized catalog by an instance with id.
    for (const label of sourceField.getLabels()) {
      const resolved = this.localizedCatalogRepository.findByIdentity(
        label.getLocalizedCatalog(),
      );
      if (resolved) {
        label.setLocalizedCatalog(resolved);
      }
    }

    if (isFullContext) {
      await this.sourceFieldRepository.addEntityToBulk(sourceField);
    } else {
      await this.sourceFieldRepository.createOrUpdate(sourceField);
    }
  }

  /**
   * Sync all source field options.
   */
  async syncAllSourceFieldOptions(
    sourceFieldOptions: Iterable<SourceFieldOption>,
    clean = false,
    dryRun = true,
  ): Promise<void> {
    await this.metadataRepository.findAll();
    await this.sourceFieldRepository.findAll();
    await this.localizedCatalogRepository.findAll();
    const existingSourceFieldOptions = clean
      ? new Map(await this.sourceFieldOptionRepository.findAll())
      : new Map<string, SourceFieldOption>();

    for (const sourceFieldOption of sourceFieldOptions) {
      await this.syncSourceFieldOption(sourceFieldOption, true);
      existingSourceFieldOptions.delete(
        this.sourceFieldOptionRepository.getIdentity(sourceFieldOption),
      );
    }

    await this.sourceFieldOptionRepository.runBulk();

    if (clean) {
      for (const sourceFieldOption of existingSourceFieldOptions.values()) {
        if (!dryRun) {
          await this.sourceFieldOptionRepository.delete(sourceFieldOption);
        }
      }

      console.log(
        `  Delete ${existingSourceFieldOptions.size} source field option(s)`,
      );
      console.log('');
    }
  }

  /**
   * Sync a single source field option.
   */
  async syncSourceFieldOption(
    sourceFieldOption: SourceFieldOption,
    isFullContext = false,
  ): Promise<void> {
    if (!isFullContext) {
      await this.fetchEntityUri(
        sourceFieldOption.getSourceField(),
        this.sourceFieldRepository as AbstractRepository<any>,
        {
          entity: sourceFieldOption
            .getSourceField()
            .getMetadata()
            .getEntity(),
          code: sourceFieldOption.getSourceField().getCode(),
        },
      );

      await this.fetchEntityUri(
        sourceFieldOption,
        this.sourceFieldOptionRepository as AbstractRepository<any>,
        {
          sourceField: sourceFieldOption.getSourceField().getUri(),
          code: sourceFieldOption.getCode(),
        },
      );
    }

    const resolvedSourceField =
      this.sourceFieldRepository.findByIdentity(
        sourceFieldOption.getSourceField(),
      );
    if (resolvedSourceField) {
      sourceFieldOption.setSourceField(resolvedSourceField);
    }

    // Replace localized catalog by an instance with id.
    for (const label of sourceFieldOption.getLabels()) {
      const resolved = this.localizedCatalogRepository.findByIdentity(
        label.getLocalizedCatalog(),
      );
      if (resolved) {
        label.setLocalizedCatalog(resolved);
      }
    }

    if (isFullContext) {
      await this.sourceFieldOptionRepository.addEntityToBulk(
        sourceFieldOption,
      );
    } else {
      await this.sourceFieldOptionRepository.createOrUpdate(
        sourceFieldOption,
      );
    }
  }

  /**
   * Fetch and set entity URI from existing entities.
   */
  private async fetchEntityUri(
    entity: AbstractEntity,
    repository: AbstractRepository<any>,
    criteria: Record<string, any>,
  ): Promise<void> {
    let code: string | undefined;
    let entityCode: string | undefined;

    if (entity instanceof SourceFieldOption) {
      code = criteria['code'] as string;
      delete criteria['code'];
    }
    if (entity instanceof Metadata) {
      entityCode = criteria['entity'] as string;
      delete criteria['entity'];
    }

    const existingEntities = await repository.findBy(criteria);

    if (existingEntities.size === 1) {
      const existingEntity = existingEntities.values().next().value;
      if (existingEntity) {
        entity.setUri(existingEntity.getUri());
      }
    } else if (code !== undefined) {
      for (const existingEntity of existingEntities.values()) {
        if (
          'getCode' in existingEntity &&
          (existingEntity as any).getCode() === code
        ) {
          entity.setUri(existingEntity.getUri());
          break;
        }
      }
    } else if (entityCode !== undefined) {
      for (const existingEntity of existingEntities.values()) {
        if (
          'getEntity' in existingEntity &&
          (existingEntity as any).getEntity() === entityCode
        ) {
          entity.setUri(existingEntity.getUri());
          break;
        }
      }
    }
  }
}
