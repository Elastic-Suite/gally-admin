/**
 * Integration Test: Tracking Events
 *
 * Tests the TrackingEventManager service by pushing tracking events
 * against a real Gally instance.
 *
 * Each test case mirrors the PHP TrackingEventTest data provider from
 * gally-standard (src/Tracker/Tests/Api/GraphQl/TrackingEventTest.php).
 *
 * Run: npx vitest run tests/integration/05-tracking-events.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { Configuration, TrackingEventManager } from '@gally/sdk'
import { checkGallyAvailability, getTestConfiguration } from '../test-config'
import {
  // Valid event fixtures
  categoryViewEvent,
  categoryProductDisplayEvent,
  searchResultViewEvent,
  searchProductDisplayEvent,
  productViewEvent,
  addToCartProductEvent,
  orderProductEvent,
  // Invalid event fixtures
  invalidViewMissingEntityCode,
  invalidCategoryViewMissingProductList,
  invalidDisplayMissingContext,
  invalidDisplayEmptyItems,
  invalidSearchMissingSearchQuery,
  invalidAddToCartMissingEntityCode,
  invalidOrderMissingOrder,
} from '../fixtures/sample-tracking-events'

describe('Tracking Events', () => {
  let config: Configuration
  let manager: TrackingEventManager
  let isAvailable: boolean

  beforeAll(async () => {
    isAvailable = await checkGallyAvailability()
    if (!isAvailable) return

    config = getTestConfiguration()
    manager = new TrackingEventManager(config)
  })

  // =========================================================================
  // Happy-path tests — one per PHP data provider case
  // =========================================================================

  it('should push a category view event', async ({ skip }) => {
    if (!isAvailable) skip()

    const result = await manager.pushViewEvent(categoryViewEvent)
    expect(result.id).toBeDefined()
  })

  it('should push a category product display event', async ({ skip }) => {
    if (!isAvailable) skip()

    const result = await manager.pushDisplayEvent(categoryProductDisplayEvent)
    expect(result.id).toBeDefined()
  })

  it('should push a search result view event', async ({ skip }) => {
    if (!isAvailable) skip()

    const result = await manager.pushSearchEvent(searchResultViewEvent)
    expect(result.id).toBeDefined()
  })

  it('should push a search product display event', async ({ skip }) => {
    if (!isAvailable) skip()

    const result = await manager.pushDisplayEvent(searchProductDisplayEvent)
    expect(result.id).toBeDefined()
  })

  it('should push a product view event', async ({ skip }) => {
    if (!isAvailable) skip()

    const result = await manager.pushViewEvent(productViewEvent)
    expect(result.id).toBeDefined()
  })

  it('should push an add to cart product event', async ({ skip }) => {
    if (!isAvailable) skip()

    const result = await manager.pushAddToCartEvent(addToCartProductEvent)
    expect(result.id).toBeDefined()
  })

  it('should push an order product event', async ({ skip }) => {
    if (!isAvailable) skip()

    const result = await manager.pushOrderEvent(orderProductEvent)
    expect(result.id).toBeDefined()
  })

  // =========================================================================
  // Validation rejection tests — one per constraint
  // =========================================================================

  it('should reject a view event missing entityCode', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(
      manager.pushViewEvent(invalidViewMissingEntityCode),
    ).rejects.toThrow('entityCode is required')
  })

  it('should reject a category view event missing payload.product_list', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(
      manager.pushViewEvent(invalidCategoryViewMissingProductList),
    ).rejects.toThrow('payload.product_list is required')
  })

  it('should reject a display event missing context info', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(
      manager.pushDisplayEvent(invalidDisplayMissingContext),
    ).rejects.toThrow('contextType is required')
  })

  it('should reject a display event with empty items array', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(
      manager.pushDisplayEvent(invalidDisplayEmptyItems),
    ).rejects.toThrow('payload.items must be a non-empty array')
  })

  it('should reject a search event missing payload.search_query', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(
      manager.pushSearchEvent(invalidSearchMissingSearchQuery),
    ).rejects.toThrow('payload.search_query is required')
  })

  it('should reject an add_to_cart event missing entityCode', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(
      manager.pushAddToCartEvent(invalidAddToCartMissingEntityCode),
    ).rejects.toThrow('entityCode is required')
  })

  it('should reject an order event missing payload.order', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(
      manager.pushOrderEvent(invalidOrderMissingOrder),
    ).rejects.toThrow('payload.order is required')
  })
})
