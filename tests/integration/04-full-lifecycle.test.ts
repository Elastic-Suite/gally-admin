/**
 * Integration Test: Full End-to-End Lifecycle
 *
 * Runs the complete SDK lifecycle in a single test:
 * 1. Sync catalog structure
 * 2. Sync source fields
 * 3. Create index
 * 4. Bulk-index documents
 * 5. Install index
 * 6. Search and verify results
 *
 * This test is self-contained and can be run independently.
 *
 * Run: npx vitest run tests/integration/04-full-lifecycle.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest'
import {
  Configuration,
  StructureSynchronizer,
  IndexOperation,
  SearchManager,
  Request,
} from '../../src'
import {
  allLocalizedCatalogs,
  createSampleSourceFields,
  categoryMetadata,
  productMetadata,
  sampleLocalizedCatalogFr,
  sampleCategoriesFr,
  sampleProductsFr,
} from '../fixtures/sample-data'
import { checkGallyAvailability, getTestConfiguration } from '../test-config'

describe('Full E2E Lifecycle', () => {
  let config: Configuration
  let isAvailable: boolean

  beforeAll(async () => {
    isAvailable = await checkGallyAvailability()
    if (!isAvailable) return
    config = getTestConfiguration()
  })

  it('should execute the complete sync → index → search lifecycle', async ({
    skip,
  }) => {
    if (!isAvailable) skip()

    // -----------------------------------------------------------------------
    // Step 1: Sync catalog structure
    // -----------------------------------------------------------------------
    console.log('\n  === Step 1: Syncing catalog structure ===')
    const synchronizer = new StructureSynchronizer(config)
    await synchronizer.syncAllLocalizedCatalogs(allLocalizedCatalogs)
    console.log('  ✓ Catalogs and localized catalogs synced')

    // -----------------------------------------------------------------------
    // Step 2: Sync source fields
    // -----------------------------------------------------------------------
    console.log('\n  === Step 2: Syncing source fields ===')
    const sourceFields = createSampleSourceFields()
    await synchronizer.syncAllSourceFields(sourceFields)
    console.log(`  ✓ ${sourceFields.length} source fields synced`)

    // -----------------------------------------------------------------------
    // Step 3: Create and index categories
    // -----------------------------------------------------------------------
    console.log('\n  === Step 3: Indexing categories ===')
    const indexOp = new IndexOperation(config)
    const catIndex = await indexOp.createIndex(
      categoryMetadata,
      sampleLocalizedCatalogFr,
    )
    expect(catIndex.getName()).toBeTruthy()
    await indexOp.executeBulk(catIndex, sampleCategoriesFr)
    await indexOp.refreshIndex(catIndex)
    await indexOp.installIndex(catIndex)
    console.log(
      `  ✓ ${sampleCategoriesFr.length} categories indexed and installed: ${catIndex.getName()}`,
    )

    // -----------------------------------------------------------------------
    // Step 4: Create product index
    // -----------------------------------------------------------------------
    console.log('\n  === Step 4: Creating product index ===')
    const index = await indexOp.createIndex(
      productMetadata,
      sampleLocalizedCatalogFr,
    )
    expect(index.getName()).toBeTruthy()
    console.log(`  ✓ Index created: ${index.getName()}`)

    // -----------------------------------------------------------------------
    // Step 5: Bulk-index documents
    // -----------------------------------------------------------------------
    console.log('\n  === Step 5: Indexing documents ===')
    await indexOp.executeBulk(index, sampleProductsFr)
    console.log(`  ✓ ${sampleProductsFr.length} products indexed`)

    // -----------------------------------------------------------------------
    // Step 6: Refresh + Install index
    // -----------------------------------------------------------------------
    console.log('\n  === Step 6: Installing index ===')
    await indexOp.refreshIndex(index)
    await indexOp.installIndex(index)
    console.log(`  ✓ Index installed (live): ${index.getName()}`)

    // Wait for Elasticsearch to make data searchable
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // -----------------------------------------------------------------------
    // Step 7: Search and verify
    // -----------------------------------------------------------------------
    console.log('\n  === Step 7: Searching ===')
    const searchManager = new SearchManager(config)

    // 6a. Broad search (all products)
    const allProductsRequest = new Request({
      localizedCatalog: sampleLocalizedCatalogFr,
      metadata: productMetadata,
      isAutocomplete: false,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 10,
      filters: [],
    })

    const allProductsResponse = await searchManager.search(allProductsRequest)
    expect(allProductsResponse.getTotalCount()).toBeGreaterThanOrEqual(1)
    console.log(
      `  ✓ Broad search: ${allProductsResponse.getTotalCount()} products found`,
    )

    // 6b. Text search
    const nikeRequest = new Request({
      localizedCatalog: sampleLocalizedCatalogFr,
      metadata: productMetadata,
      isAutocomplete: false,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 10,
      searchQuery: 'Nike',
      filters: [],
    })

    const nikeResponse = await searchManager.search(nikeRequest)
    expect(nikeResponse.getTotalCount()).toBeGreaterThanOrEqual(1)
    console.log(
      `  ✓ Text search "Nike": ${nikeResponse.getTotalCount()} products found`,
    )

    // 6c. Pagination
    const pageRequest = new Request({
      localizedCatalog: sampleLocalizedCatalogFr,
      metadata: productMetadata,
      isAutocomplete: false,
      selectedFields: ['id', 'sku', 'name'],
      currentPage: 1,
      pageSize: 2,
      filters: [],
    })

    const pageResponse = await searchManager.search(pageRequest)
    expect(pageResponse.getItemsPerPage()).toBe(2)
    expect(pageResponse.getCollection().length).toBeLessThanOrEqual(2)
    console.log(
      `  ✓ Pagination: ${pageResponse.getCollection().length} items per page, ` +
        `${pageResponse.getLastPage()} total pages`,
    )

    console.log('\n  === All steps completed successfully! ===\n')
  })
})
