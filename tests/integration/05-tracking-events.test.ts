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
import {
  TrackingEventManager,
  TrackingEventInput,
  SessionInformationStorage,
  TrackingEventContextStorage,
  TrackingEventContextSessionStorage,
  EventQueueStorage,
  TrackingEventType,
} from '@gally/sdk'
import { vi } from 'vitest'
import { checkGallyAvailability } from '../test-config'
import {
  // Valid event fixtures
  categoryViewEvent,
  categoryProductDisplayEvent,
  searchResultViewEvent,
  searchProductDisplayEvent,
  productViewEvent,
  addToCartProductEvent,
  orderProductEvent,
  // English catalog event fixtures
  productViewEventEN,
  searchResultViewEventEN,
  addToCartProductEventEN,
  searchProductDisplayEventEN,
  // Invalid event fixtures
  invalidViewMissingEntityCode,
  invalidCategoryViewMissingProductList,
  invalidDisplayMissingContext,
  invalidDisplayEmptyItems,
  invalidSearchMissingSearchQuery,
  invalidAddToCartMissingEntityCode,
  invalidOrderMissingOrder,
} from '../fixtures/sample-tracking-events'

// ---------------------------------------------------------------------------
// Node.js-compatible storage implementations
// sessionStorage, localStorage, and document.cookie are not available in Node.
// ---------------------------------------------------------------------------

/** Returns fixed UUIDs — no cookie access required. */
class FixedSessionStorage extends SessionInformationStorage {
  getSessionInformation() {
    return {
      sessionUid: '2a9c9f2d-0aff-5c1c-b0a8-98cb6460a1d2',
      sessionVid: '55779ebd-9f1f-3ca8-dabf-0d2d83306f32',
    }
  }
  clearSessionInformation() {}
}

// ---------------------------------------------------------------------------
// Mock sessionStorage for Node.js
// to persist context in some tests for context auto injection
// ---------------------------------------------------------------------------

const storage: Record<string, string> = {}
global.sessionStorage = {
  getItem: (key: string) => storage[key] || null,
  setItem: (key: string, value: string) => {
    storage[key] = value
  },
  removeItem: (key: string) => {
    delete storage[key]
  },
  clear: () => {
    Object.keys(storage).forEach((k) => delete storage[k])
  },
  length: 0, // Not fully accurate but enough for our needs
  key: (index: number) => Object.keys(storage)[index] || null,
} as unknown as Storage

/** No-op context storage — context fields are provided explicitly in fixtures. */
class NoopContextStorage extends TrackingEventContextStorage {
  isUpdateContextEvent() {
    return false
  }
  checkAndUpdateContext() {
    return false
  }
  getTrackingContext() {
    return null
  }
  getSelfContext() {
    return null
  }
}

/** In-memory queue — no localStorage access required. */
class InMemoryQueueStorage extends EventQueueStorage {
  private queue: TrackingEventInput[] = []
  enqueue(input: TrackingEventInput) {
    this.queue.push(input)
  }
  dequeueAll() {
    return this.queue.splice(0)
  }
  clear() {
    this.queue = []
  }
  size() {
    return this.queue.length
  }
}

describe('Tracking Events', () => {
  let manager: TrackingEventManager
  let isAvailable: boolean

  beforeAll(async () => {
    isAvailable = await checkGallyAvailability()
    if (!isAvailable) return

    manager = TrackingEventManager.init({
      baseUri: process.env['GALLY_BASE_URI']!,
      sessionInformationStorage: new FixedSessionStorage(),
      trackingEventContextStorage: new NoopContextStorage(),
      eventQueueStorage: new InMemoryQueueStorage(),
    })
  })

  // =========================================================================
  // Happy-path tests — one per PHP data provider case
  // =========================================================================

  it('should push a category view event', async ({ skip }) => {
    if (!isAvailable) skip()
    const result = await manager.push(categoryViewEvent)
    expect(result.id).toBeDefined()
  })

  it('should push a category product display event', async ({ skip }) => {
    if (!isAvailable) skip()
    const result = await manager.push(categoryProductDisplayEvent)
    expect(result.id).toBeDefined()
  })

  it('should push a search result view event', async ({ skip }) => {
    if (!isAvailable) skip()
    const result = await manager.push(searchResultViewEvent)
    expect(result.id).toBeDefined()
  })

  it('should push a search product display event', async ({ skip }) => {
    if (!isAvailable) skip()
    const result = await manager.push(searchProductDisplayEvent)
    expect(result.id).toBeDefined()
  })

  it('should push a product view event', async ({ skip }) => {
    if (!isAvailable) skip()
    const result = await manager.push(productViewEvent)
    expect(result.id).toBeDefined()
  })

  it('should push an add to cart product event', async ({ skip }) => {
    if (!isAvailable) skip()
    const result = await manager.push(addToCartProductEvent)
    expect(result.id).toBeDefined()
  })

  it('should push an order product event', async ({ skip }) => {
    if (!isAvailable) skip()
    const result = await manager.push(orderProductEvent)
    expect(result.id).toBeDefined()
  })

  // =========================================================================
  // English catalog tests — positive cases to differentiate from French
  // =========================================================================

  it('should push a product view event for English catalog', async ({
    skip,
  }) => {
    if (!isAvailable) skip()
    const result = await manager.push(productViewEventEN)
    expect(result.id).toBeDefined()
  })

  it('should push a search result view event for English catalog', async ({
    skip,
  }) => {
    if (!isAvailable) skip()
    const result = await manager.push(searchResultViewEventEN)
    expect(result.id).toBeDefined()
  })

  it('should push an add to cart event for English catalog', async ({
    skip,
  }) => {
    if (!isAvailable) skip()
    const result = await manager.push(addToCartProductEventEN)
    expect(result.id).toBeDefined()
  })

  it('should push a search product display event for English catalog', async ({
    skip,
  }) => {
    if (!isAvailable) skip()
    const result = await manager.push(searchProductDisplayEventEN)
    expect(result.id).toBeDefined()
  })

  // =========================================================================
  // Validation rejection tests — one per constraint
  // =========================================================================

  it('should reject a view event missing entityCode', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(manager.push(invalidViewMissingEntityCode)).rejects.toThrow(
      'entityCode is required',
    )
  })

  it('should reject a category view event missing payload.product_list', async ({
    skip,
  }) => {
    if (!isAvailable) skip()
    await expect(
      manager.push(invalidCategoryViewMissingProductList),
    ).rejects.toThrow('payload.product_list is required')
  })

  it('should reject a display event missing context info', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(manager.push(invalidDisplayMissingContext)).rejects.toThrow(
      'contextType is required',
    )
  })

  it('should reject a display event with empty items array', async ({
    skip,
  }) => {
    if (!isAvailable) skip()
    await expect(manager.push(invalidDisplayEmptyItems)).rejects.toThrow(
      'payload.items must be a non-empty array',
    )
  })

  it('should reject a search event missing payload.search_query', async ({
    skip,
  }) => {
    if (!isAvailable) skip()
    await expect(manager.push(invalidSearchMissingSearchQuery)).rejects.toThrow(
      'payload.search_query is required',
    )
  })

  it('should reject an add_to_cart event missing entityCode', async ({
    skip,
  }) => {
    if (!isAvailable) skip()
    await expect(
      manager.push(invalidAddToCartMissingEntityCode),
    ).rejects.toThrow('entityCode is required')
  })

  it('should reject an order event missing payload.order', async ({ skip }) => {
    if (!isAvailable) skip()
    await expect(manager.push(invalidOrderMissingOrder)).rejects.toThrow(
      'payload.order is required',
    )
  })

  // =========================================================================
  // Batching tests
  // =========================================================================

  it('should batch multiple events into a single request', async ({ skip }) => {
    if (!isAvailable) skip()

    const results = await Promise.all([
      manager.push(productViewEvent),
      manager.push(searchProductDisplayEvent),
      manager.push(addToCartProductEvent),
    ])

    expect(results).toHaveLength(3)
    results.forEach((result) => expect(result.id).toBeDefined())
  })

  // =========================================================================
  // Context Injection tests
  // =========================================================================

  describe('Context Injection', () => {
    beforeAll(() => {
      // Re-initialize manager with real context storage for these tests
      TrackingEventManager.resetInstance()
      manager = TrackingEventManager.init({
        baseUri: process.env['GALLY_BASE_URI']!,
        sessionInformationStorage: new FixedSessionStorage(),
        trackingEventContextStorage: new TrackingEventContextSessionStorage(),
        eventQueueStorage: new InMemoryQueueStorage(),
      })
    })

    it('should inject category context into subsequent display events', async ({
      skip,
    }) => {
      if (!isAvailable) skip()

      sessionStorage.clear()

      // 1. Push category view (updates context)
      await manager.push({
        ...categoryViewEvent,
        entityCode: 'cat_shoes_test',
      })

      // 2. Push display WITHOUT context
      const displayInputWithoutContext: TrackingEventInput = {
        eventType: TrackingEventType.DISPLAY,
        metadataCode: 'product',
        localizedCatalogCode: 'fr_FR',
        payload: JSON.stringify({
          items: [{ entityCode: 'p1', display: { position: 1 } }],
        }),
      }

      // We spy on the client to see what is actually sent
      const spy = vi.spyOn((manager as any).client, 'graphql')

      await manager.push(displayInputWithoutContext)

      // The actual input sent to GraphQL should have context injected
      const lastCall = spy.mock.calls[spy.mock.calls.length - 1]
      const variables = lastCall![1] as any
      const sentInput = variables.input0

      expect(sentInput.contextType).toBe('category')
      expect(sentInput.contextCode).toBe('cat_shoes_test')
      expect(sentInput.sourceEventType).toBe(TrackingEventType.VIEW)
      expect(sentInput.sourceMetadataCode).toBe('category')

      spy.mockRestore()
    })

    it('should inject search context into subsequent display events', async ({
      skip,
    }) => {
      if (!isAvailable) skip()

      sessionStorage.clear()

      // 1. Push search event (updates context with query)
      await manager.push(searchResultViewEvent)

      // 2. Push display WITHOUT context
      const displayInputWithoutContext: TrackingEventInput = {
        eventType: TrackingEventType.DISPLAY,
        metadataCode: 'product',
        localizedCatalogCode: 'fr_FR',
        payload: JSON.stringify({
          items: [{ entityCode: 'p2', display: { position: 1 } }],
        }),
      }

      const spy = vi.spyOn((manager as any).client, 'graphql')
      await manager.push(displayInputWithoutContext)

      const lastCall = spy.mock.calls[spy.mock.calls.length - 1]
      const variables = lastCall![1] as any
      const sentInput = variables.input0

      expect(sentInput.contextType).toBe('search')
      expect(sentInput.contextCode).toBe('shoe') // From fixture
      expect(sentInput.sourceEventType).toBe(TrackingEventType.SEARCH)
      expect(sentInput.sourceMetadataCode).toBe('product')

      spy.mockRestore()
    })

    it('should self-inject search context and override existing category context', async ({
      skip,
    }) => {
      if (!isAvailable) skip()

      sessionStorage.clear()

      // 1. Start with a category context
      await manager.push({
        ...categoryViewEvent,
        entityCode: 'cat_prev',
      })

      // 2. Push a search event (should use its own context)
      const spy = vi.spyOn((manager as any).client, 'graphql')
      await manager.push(searchResultViewEvent)

      const lastCall = spy.mock.calls[spy.mock.calls.length - 1]
      const variables = lastCall![1] as any
      const sentInput = variables.input0

      // Verification: The search event itself should have 'search' context, not the stale 'category' one
      expect(sentInput.contextType).toBe('search')
      expect(sentInput.contextCode).toBe('shoe')

      spy.mockRestore()
    })
  })
})
