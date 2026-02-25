/**
 * Integration Test: Search
 *
 * Tests the SearchManager service by executing search queries
 * against a real Gally instance with previously indexed data.
 *
 * Prerequisites: structure sync + index operations tests must have run first.
 *
 * Run: npm run test:integration
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  SearchManager,
  StructureSynchronizer,
  IndexOperation,
  Configuration,
  Request,
} from '../../src/index';
import {
  allLocalizedCatalogs,
  createSampleSourceFields,
  categoryMetadata,
  productMetadata,
  sampleLocalizedCatalogFr,
  sampleLocalizedCatalogEn,
  sampleCategoriesFr,
  sampleCategoriesEn,
  sampleProductsFr,
  sampleProductsEn,
} from '../fixtures/sample-data';
import { checkGallyAvailability, getTestConfiguration } from '../test-config';

describe('Search', () => {
  let config: Configuration;
  let searchManager: SearchManager;
  let isAvailable: boolean;

  beforeAll(async () => {
    isAvailable = await checkGallyAvailability();
    if (!isAvailable) return;

    config = getTestConfiguration();
    searchManager = new SearchManager(config);

    // Ensure structure + indexes are ready
    const synchronizer = new StructureSynchronizer(config);
    await synchronizer.syncAllLocalizedCatalogs(allLocalizedCatalogs);
    await synchronizer.syncAllSourceFields(createSampleSourceFields());

    const indexOp = new IndexOperation(config);

    // Create + index + install categories FR
    const catIndexFr = await indexOp.createIndex(
      categoryMetadata,
      sampleLocalizedCatalogFr,
    );
    await indexOp.executeBulk(catIndexFr, sampleCategoriesFr);
    await indexOp.refreshIndex(catIndexFr);
    await indexOp.installIndex(catIndexFr);

    // Create + index + install categories EN
    const catIndexEn = await indexOp.createIndex(
      categoryMetadata,
      sampleLocalizedCatalogEn,
    );
    await indexOp.executeBulk(catIndexEn, sampleCategoriesEn);
    await indexOp.refreshIndex(catIndexEn);
    await indexOp.installIndex(catIndexEn);

    // Create + index + install FR products
    const indexFr = await indexOp.createIndex(
      productMetadata,
      sampleLocalizedCatalogFr,
    );
    await indexOp.executeBulk(indexFr, sampleProductsFr);
    await indexOp.refreshIndex(indexFr);
    await indexOp.installIndex(indexFr);

    // Create + index + install EN products
    const indexEn = await indexOp.createIndex(
      productMetadata,
      sampleLocalizedCatalogEn,
    );
    await indexOp.executeBulk(indexEn, sampleProductsEn);
    await indexOp.refreshIndex(indexEn);
    await indexOp.installIndex(indexEn);

    // Give Elasticsearch a moment to make data searchable
    await new Promise((resolve) => setTimeout(resolve, 3000));
  });

  it('should search all products in FR catalog', async ({ skip }) => {
    if (!isAvailable) skip();

    const request = new Request({
      localizedCatalog: sampleLocalizedCatalogFr,
      metadata: productMetadata,
      isAutocomplete: false,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 10,
      filters: [],
    });

    const response = await searchManager.search(request);

    expect(response.getTotalCount()).toBeGreaterThanOrEqual(1);
    expect(response.getCollection().length).toBeGreaterThanOrEqual(1);

    console.log(`  FR search: ${response.getTotalCount()} total results`);
    for (const product of response.getCollection()) {
      console.log(`    - ${JSON.stringify(product)}`);
    }
  });

  it('should search products with a text query in FR', async ({ skip }) => {
    if (!isAvailable) skip();

    const request = new Request({
      localizedCatalog: sampleLocalizedCatalogFr,
      metadata: productMetadata,
      isAutocomplete: false,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 10,
      searchQuery: 'Nike',
      filters: [],
    });

    const response = await searchManager.search(request);

    expect(response.getTotalCount()).toBeGreaterThanOrEqual(1);

    const collection = response.getCollection();
    console.log(
      `  FR search "Nike": ${response.getTotalCount()} results`,
    );
    for (const product of collection) {
      console.log(`    - ${JSON.stringify(product)}`);
    }
  });

  it('should search all products in EN catalog', async ({ skip }) => {
    if (!isAvailable) skip();

    const request = new Request({
      localizedCatalog: sampleLocalizedCatalogEn,
      metadata: productMetadata,
      isAutocomplete: false,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 10,
      filters: [],
    });

    const response = await searchManager.search(request);

    expect(response.getTotalCount()).toBeGreaterThanOrEqual(1);

    console.log(`  EN search: ${response.getTotalCount()} total results`);
  });

  it('should support pagination', async ({ skip }) => {
    if (!isAvailable) skip();

    const request = new Request({
      localizedCatalog: sampleLocalizedCatalogFr,
      metadata: productMetadata,
      isAutocomplete: false,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 2,
      filters: [],
    });

    const response = await searchManager.search(request);

    expect(response.getItemsPerPage()).toBe(2);
    expect(response.getCollection().length).toBeLessThanOrEqual(2);

    if (response.getTotalCount() > 2) {
      expect(response.getLastPage()).toBeGreaterThan(1);
    }

    console.log(
      `  Pagination: page 1, ${response.getCollection().length} items, ` +
        `${response.getLastPage()} total pages`,
    );
  });

  it('should return aggregations (facets)', async ({ skip }) => {
    if (!isAvailable) skip();

    const request = new Request({
      localizedCatalog: sampleLocalizedCatalogFr,
      metadata: productMetadata,
      isAutocomplete: false,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 10,
      filters: [],
    });

    const response = await searchManager.search(request);
    const aggregations = response.getAggregations();

    // Aggregations might be empty depending on Gally config, but the API call should succeed
    console.log(`  Aggregations: ${aggregations.length} facets returned`);
    for (const agg of aggregations) {
      console.log(
        `    - ${agg.field} (${agg.type}): ${agg.count} options`,
      );
    }

    expect(Array.isArray(aggregations)).toBe(true);
  });

  it('should perform autocomplete search', async ({ skip }) => {
    if (!isAvailable) skip();

    const request = new Request({
      localizedCatalog: sampleLocalizedCatalogFr,
      metadata: productMetadata,
      isAutocomplete: true,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 5,
      searchQuery: 'chaussure',
      filters: [],
    });

    const response = await searchManager.search(request);

    console.log(
      `  Autocomplete "chaussure": ${response.getTotalCount()} results`,
    );

    // Autocomplete should work without errors
    expect(response).toBeDefined();
  });

  it('should get product sorting options', async ({ skip }) => {
    if (!isAvailable) skip();

    const sortingOptions = await searchManager.getProductSortingOptions();

    expect(Array.isArray(sortingOptions)).toBe(true);

    console.log(`  Sorting options: ${sortingOptions.length}`);
    for (const option of sortingOptions) {
      console.log(
        `    - ${option.getCode()} (${option.getType()}): ${option.getDefaultLabel()}`,
      );
    }
  });
});
