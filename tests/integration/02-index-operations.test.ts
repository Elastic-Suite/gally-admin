/**
 * Integration Test: Index Operations
 *
 * Tests the IndexOperation service by creating indices, bulk-indexing
 * sample products, and installing indices against a real Gally instance.
 *
 * Prerequisites: structure sync tests must have run first (catalogs + source fields must exist).
 *
 * Run: npm run test:integration
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  IndexOperation,
  StructureSynchronizer,
  Configuration,
  Index,
} from '../../src/index';
import {
  allLocalizedCatalogs,
  createSampleSourceFields,
  productMetadata,
  sampleLocalizedCatalogEn,
  sampleLocalizedCatalogFr,
  sampleProductsEn,
  sampleProductsFr,
} from '../fixtures/sample-data';
import { checkGallyAvailability, getTestConfiguration } from '../test-config';

describe('Index Operations', () => {
  let config: Configuration;
  let indexOp: IndexOperation;
  let isAvailable: boolean;
  let indexFr: Index;
  let indexEn: Index;

  beforeAll(async () => {
    isAvailable = await checkGallyAvailability();
    if (!isAvailable) return;

    config = getTestConfiguration();
    indexOp = new IndexOperation(config);

    // Ensure structure is synced before indexing
    const synchronizer = new StructureSynchronizer(config);
    await synchronizer.syncAllLocalizedCatalogs(allLocalizedCatalogs);
    await synchronizer.syncAllSourceFields(createSampleSourceFields());
  });

  it('should create an index for FR localized catalog', async ({ skip }) => {
    if (!isAvailable) skip();

    indexFr = await indexOp.createIndex(
      productMetadata,
      sampleLocalizedCatalogFr,
    );

    expect(indexFr).toBeDefined();
    expect(indexFr.getName()).toBeTruthy();
    expect(indexFr.getMetadata().getEntity()).toBe('product');

    console.log(`  Created FR index: ${indexFr.getName()}`);
  });

  it('should create an index for EN localized catalog', async ({ skip }) => {
    if (!isAvailable) skip();

    indexEn = await indexOp.createIndex(
      productMetadata,
      sampleLocalizedCatalogEn,
    );

    expect(indexEn).toBeDefined();
    expect(indexEn.getName()).toBeTruthy();

    console.log(`  Created EN index: ${indexEn.getName()}`);
  });

  it('should bulk-index FR products', async ({ skip }) => {
    if (!isAvailable || !indexFr) skip();

    await indexOp.executeBulk(indexFr, sampleProductsFr);

    // If no error was thrown, bulk indexing succeeded
    expect(true).toBe(true);
    console.log(`  Indexed ${sampleProductsFr.length} FR products`);
  });

  it('should bulk-index EN products', async ({ skip }) => {
    if (!isAvailable || !indexEn) skip();

    await indexOp.executeBulk(indexEn, sampleProductsEn);

    expect(true).toBe(true);
    console.log(`  Indexed ${sampleProductsEn.length} EN products`);
  });

  it('should refresh the FR index', async ({ skip }) => {
    if (!isAvailable || !indexFr) skip();

    await indexOp.refreshIndex(indexFr);
    expect(true).toBe(true);
  });

  it('should refresh the EN index', async ({ skip }) => {
    if (!isAvailable || !indexEn) skip();

    await indexOp.refreshIndex(indexEn);
    expect(true).toBe(true);
  });

  it('should install (make live) the FR index', async ({ skip }) => {
    if (!isAvailable || !indexFr) skip();

    await indexOp.installIndex(indexFr);
    expect(true).toBe(true);
    console.log(`  Installed FR index: ${indexFr.getName()}`);
  });

  it('should install (make live) the EN index', async ({ skip }) => {
    if (!isAvailable || !indexEn) skip();

    await indexOp.installIndex(indexEn);
    expect(true).toBe(true);
    console.log(`  Installed EN index: ${indexEn.getName()}`);
  });

  it('should retrieve a live index by name', async ({ skip }) => {
    if (!isAvailable) skip();

    // Wait a moment for the index to be fully installed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const liveIndex = await indexOp.getIndexByName(
      productMetadata,
      sampleLocalizedCatalogFr,
    );

    expect(liveIndex).toBeDefined();
    expect(liveIndex.getName()).toBeTruthy();
    console.log(`  Found live FR index: ${liveIndex.getName()}`);
  });
});
