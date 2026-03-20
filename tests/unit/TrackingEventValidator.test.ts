/**
 * Unit Test: TrackingEventValidator
 *
 * Tests the TrackingEventValidator validation logic against sample fixtures.
 * These tests run without needing a live Gally instance.
 *
 * Each test case mirrors the integration test from
 * tests/integration/05-tracking-events.test.ts
 *
 * Run: npx vitest run tests/unit/TrackingEventValidator.test.ts
 */

import { describe, it, expect } from 'vitest'
import { TrackingEventValidator, TrackingEventType } from '../../src/validator'
import { TrackingEventInput } from '../../src/service'
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

describe('TrackingEventValidator', () => {
  // =========================================================================
  // Happy-path tests — one per integration test case
  // =========================================================================

  it('should validate a category view event', () => {
    const event: TrackingEventInput = {
      ...categoryViewEvent,
      eventType: TrackingEventType.VIEW,
    }
    expect(() => TrackingEventValidator.validate(event)).not.toThrow()
  })

  it('should validate a category product display event', () => {
    const event: TrackingEventInput = {
      ...categoryProductDisplayEvent,
      eventType: TrackingEventType.DISPLAY,
    }
    expect(() => TrackingEventValidator.validate(event)).not.toThrow()
  })

  it('should validate a search result view event', () => {
    const event: TrackingEventInput = {
      ...searchResultViewEvent,
      eventType: TrackingEventType.SEARCH,
    }
    expect(() => TrackingEventValidator.validate(event)).not.toThrow()
  })

  it('should validate a search product display event', () => {
    const event: TrackingEventInput = {
      ...searchProductDisplayEvent,
      eventType: TrackingEventType.DISPLAY,
    }
    expect(() => TrackingEventValidator.validate(event)).not.toThrow()
  })

  it('should validate a product view event', () => {
    const event: TrackingEventInput = {
      ...productViewEvent,
      eventType: TrackingEventType.VIEW,
    }
    expect(() => TrackingEventValidator.validate(event)).not.toThrow()
  })

  it('should validate an add to cart product event', () => {
    const event: TrackingEventInput = {
      ...addToCartProductEvent,
      eventType: TrackingEventType.ADD_TO_CART,
    }
    expect(() => TrackingEventValidator.validate(event)).not.toThrow()
  })

  it('should validate an order product event', () => {
    const event: TrackingEventInput = {
      ...orderProductEvent,
      eventType: TrackingEventType.ORDER,
    }
    expect(() => TrackingEventValidator.validate(event)).not.toThrow()
  })

  // =========================================================================
  // Validation rejection tests — one per constraint
  // =========================================================================

  it('should reject a view event missing entityCode', () => {
    const event: TrackingEventInput = {
      ...invalidViewMissingEntityCode,
      eventType: TrackingEventType.VIEW,
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'entityCode is required for view event'
    )
  })

  it('should reject a category view event missing payload.product_list', () => {
    const event: TrackingEventInput = {
      ...invalidCategoryViewMissingProductList,
      eventType: TrackingEventType.VIEW,
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'payload.product_list is required for view event'
    )
  })

  it('should reject a display event missing context info', () => {
    const event: TrackingEventInput = {
      ...invalidDisplayMissingContext,
      eventType: TrackingEventType.DISPLAY,
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'contextType is required for display event'
    )
  })

  it('should reject a display event with empty items array', () => {
    const event: TrackingEventInput = {
      ...invalidDisplayEmptyItems,
      eventType: TrackingEventType.DISPLAY,
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'payload.items must be a non-empty array for display event'
    )
  })

  it('should reject a search event missing payload.search_query', () => {
    const event: TrackingEventInput = {
      ...invalidSearchMissingSearchQuery,
      eventType: TrackingEventType.SEARCH,
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'payload.search_query is required for search event'
    )
  })

  it('should reject an add_to_cart event missing entityCode', () => {
    const event: TrackingEventInput = {
      ...invalidAddToCartMissingEntityCode,
      eventType: TrackingEventType.ADD_TO_CART,
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'entityCode is required for add_to_cart event'
    )
  })

  it('should reject an order event missing payload.order', () => {
    const event: TrackingEventInput = {
      ...invalidOrderMissingOrder,
      eventType: TrackingEventType.ORDER,
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'payload.order is required for order event'
    )
  })

  it('should reject a category view with filter missing name', () => {
    const event: TrackingEventInput = {
      ...categoryViewEvent,
      eventType: TrackingEventType.VIEW,
      payload: JSON.stringify({
        product_list: {
          item_count: 5,
          current_page: 1,
          page_count: 1,
          sort_order: 'position',
          sort_direction: 'asc',
          filters: [{ value: '47' }],
        },
      }),
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'payload.product_list.filters[0].name is required for view event'
    )
  })

  it('should reject a search result with filter having non-string value', () => {
    const event: TrackingEventInput = {
      ...searchResultViewEvent,
      eventType: TrackingEventType.SEARCH,
      payload: JSON.stringify({
        search_query: {
          is_spellchecked: false,
          query_text: 'shoe',
        },
        product_list: {
          item_count: 5,
          current_page: 1,
          page_count: 1,
          sort_order: 'position',
          sort_direction: 'asc',
          filters: [{ name: 'fashion_material__value', value: 47 }],
        },
      }),
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'payload.product_list.filters[0].value must be of type string for search event'
    )
  })

  // =========================================================================
  // Additional coverage tests to reach 100%
  // =========================================================================

  it('should reject unsupported event type', () => {
    const event: TrackingEventInput = {
      ...categoryViewEvent,
      eventType: 'invalid_type' as any,
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'Unsupported event type: invalid_type'
    )
  })

  it('should reject event with invalid JSON payload', () => {
    const event: TrackingEventInput = {
      ...categoryViewEvent,
      eventType: TrackingEventType.VIEW,
      payload: '{invalid json}',
    }
    expect(() => TrackingEventValidator.validate(event)).toThrow(
      'payload must be a valid JSON string'
    )
  })
})
