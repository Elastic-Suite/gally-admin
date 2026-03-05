/**
 * Integration Test: Structure Synchronization
 *
 * Tests the StructureSynchronizer service by syncing catalogs,
 * localized catalogs, metadata, source fields and source field options
 * against a real Gally instance.
 *
 * Run: npm run test:integration
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  StructureSynchronizer,
  Configuration,
  Client,
  CatalogRepository,
  LocalizedCatalogRepository,
  MetadataRepository,
  SourceFieldRepository,
} from '../../src';
import {
  allLocalizedCatalogs,
  createSampleSourceFields,
  createSampleSourceFieldOptions,
  sampleLocalizedCatalogFr,
  sampleLocalizedCatalogEn,
} from '../fixtures/sample-data';
import { checkGallyAvailability, getTestConfiguration } from '../test-config';

describe('Structure Synchronization', () => {
  let config: Configuration;
  let synchronizer: StructureSynchronizer;
  let isAvailable: boolean;

  beforeAll(async () => {
    isAvailable = await checkGallyAvailability();
    if (!isAvailable) return;

    config = getTestConfiguration();
    synchronizer = new StructureSynchronizer(config);
  });

  it('should sync localized catalogs', async ({ skip }) => {
    if (!isAvailable) skip();

    await synchronizer.syncAllLocalizedCatalogs(allLocalizedCatalogs);

    // Verify catalogs and localized catalogs were created by re-fetching them
    const client = new Client(config);
    const catalogRepo = new CatalogRepository(client);
    const localizedCatalogRepo = new LocalizedCatalogRepository(
      client,
      catalogRepo,
    );

    const catalogs = await catalogRepo.findAll();
    const localizedCatalogs = await localizedCatalogRepo.findAll();

    expect(catalogs.has('sdk_test_shop')).toBe(true);
    expect(localizedCatalogs.has('sdk_test_shop_fr')).toBe(true);
    expect(localizedCatalogs.has('sdk_test_shop_en')).toBe(true);

    const frCatalog = localizedCatalogs.get('sdk_test_shop_fr')!;
    expect(frCatalog.getLocale()).toBe('fr_FR');
    expect(frCatalog.getCurrency()).toBe('EUR');

    const enCatalog = localizedCatalogs.get('sdk_test_shop_en')!;
    expect(enCatalog.getLocale()).toBe('en_US');
    expect(enCatalog.getCurrency()).toBe('USD');
  });

  it('should sync source fields', async ({ skip }) => {
    if (!isAvailable) skip();

    const sourceFields = createSampleSourceFields();
    await synchronizer.syncAllSourceFields(sourceFields);

    // Verify source fields were created
    const client = new Client(config);
    const metadataRepo = new MetadataRepository(client);
    const sourceFieldRepo = new SourceFieldRepository(client, metadataRepo);

    const existingFields = await sourceFieldRepo.findBy({
      'metadata.entity': 'product',
    });

    // Our sample fields should exist
    expect(existingFields.has('product_name')).toBe(true);
    expect(existingFields.has('product_sku')).toBe(true);
    expect(existingFields.has('product_brand')).toBe(true);
    expect(existingFields.has('product_color')).toBe(true);
    expect(existingFields.has('product_description')).toBe(true);

    const nameField = existingFields.get('product_name')!;
    expect(nameField.getType()).toBe('text');
    expect(nameField.getDefaultLabel()).toBe('Name');
  });

  it('should sync source field options for select fields', async ({ skip }) => {
    if (!isAvailable) skip();

    // Fetch synced source fields to get their URIs
    const client = new Client(config);
    const metadataRepo = new MetadataRepository(client);
    const sourceFieldRepo = new SourceFieldRepository(client, metadataRepo);

    const existingFields = await sourceFieldRepo.findBy({
      'metadata.entity': 'product',
    });

    const brandField = existingFields.get('product_brand');
    const colorField = existingFields.get('product_color');

    expect(brandField).toBeDefined();
    expect(colorField).toBeDefined();

    if (!brandField || !colorField) return;

    const options = createSampleSourceFieldOptions(brandField, colorField);
    await synchronizer.syncAllSourceFieldOptions(options);

    // If we get here without errors, source field options were synced successfully
    expect(true).toBe(true);
  });

  it('should be idempotent (re-sync without errors)', async ({ skip }) => {
    if (!isAvailable) skip();

    // Re-syncing should not throw — upsert behavior
    await synchronizer.syncAllLocalizedCatalogs(allLocalizedCatalogs);

    const sourceFields = createSampleSourceFields();
    await synchronizer.syncAllSourceFields(sourceFields);

    expect(true).toBe(true);
  });

  it('should sync a single localized catalog', async ({ skip }) => {
    if (!isAvailable) skip();

    const result = await synchronizer.syncLocalizedCatalog(
      sampleLocalizedCatalogFr,
    );

    expect(result).toBeDefined();
    expect(result.getUri()).toBeTruthy();
    expect(result.getCode()).toBe('sdk_test_shop_fr');
  });

  it('should handle re-sync of a single localized catalog', async ({ skip }) => {
    if (!isAvailable) skip();

    const result = await synchronizer.syncLocalizedCatalog(
      sampleLocalizedCatalogEn,
    );

    expect(result).toBeDefined();
    expect(result.getUri()).toBeTruthy();
    expect(result.getCode()).toBe('sdk_test_shop_en');
  });
});
