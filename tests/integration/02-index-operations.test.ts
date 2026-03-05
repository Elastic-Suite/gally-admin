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
} from '../../src';
import {
  allLocalizedCatalogs,
  createSampleSourceFields,
  categoryMetadata,
  productMetadata,
  sampleCategoriesEn,
  sampleCategoriesFr,
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
  let catIndexFr: Index;
  let catIndexEn: Index;

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

  // -------------------------------------------------------------------------
  // Category indexing
  // -------------------------------------------------------------------------

  it('should create a category index for FR localized catalog', async ({ skip }) => {
    if (!isAvailable) skip();

    catIndexFr = await indexOp.createIndex(
      categoryMetadata,
      sampleLocalizedCatalogFr,
    );

    expect(catIndexFr).toBeDefined();
    expect(catIndexFr.getName()).toBeTruthy();
    expect(catIndexFr.getMetadata().getEntity()).toBe('category');

    console.log(`  Created FR category index: ${catIndexFr.getName()}`);
  });

  it('should create a category index for EN localized catalog', async ({ skip }) => {
    if (!isAvailable) skip();

    catIndexEn = await indexOp.createIndex(
      categoryMetadata,
      sampleLocalizedCatalogEn,
    );

    expect(catIndexEn).toBeDefined();
    expect(catIndexEn.getName()).toBeTruthy();

    console.log(`  Created EN category index: ${catIndexEn.getName()}`);
  });

  it('should bulk-index FR categories', async ({ skip }) => {
    if (!isAvailable || !catIndexFr) skip();

    await indexOp.executeBulk(catIndexFr, sampleCategoriesFr);

    expect(true).toBe(true);
    console.log(`  Indexed ${sampleCategoriesFr.length} FR categories`);
  });

  it('should bulk-index EN categories', async ({ skip }) => {
    if (!isAvailable || !catIndexEn) skip();

    await indexOp.executeBulk(catIndexEn, sampleCategoriesEn);

    expect(true).toBe(true);
    console.log(`  Indexed ${sampleCategoriesEn.length} EN categories`);
  });

  it('should install the FR category index', async ({ skip }) => {
    if (!isAvailable || !catIndexFr) skip();

    await indexOp.refreshIndex(catIndexFr);
    await indexOp.installIndex(catIndexFr);
    expect(true).toBe(true);
    console.log(`  Installed FR category index: ${catIndexFr.getName()}`);
  });

  it('should install the EN category index', async ({ skip }) => {
    if (!isAvailable || !catIndexEn) skip();

    await indexOp.refreshIndex(catIndexEn);
    await indexOp.installIndex(catIndexEn);
    expect(true).toBe(true);
    console.log(`  Installed EN category index: ${catIndexEn.getName()}`);
  });

  // -------------------------------------------------------------------------
  // Product indexing
  // -------------------------------------------------------------------------

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
