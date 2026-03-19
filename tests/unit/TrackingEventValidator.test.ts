/**
 * Unit Test: TrackingEventValidator
 *
 * Tests the TrackingEventValidator validation logic against sample fixtures.
 * These tests run without needing a live Gally instance.
 *
 * Run: npx vitest run tests/unit/TrackingEventValidator.test.ts
 */

import { describe, it, expect } from 'vitest'
import { TrackingEventValidator, TrackingEventType } from '@gally/sdk'
import { TrackingEventInput } from '@gally/sdk'
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
  // Valid events — should pass validation
  // =========================================================================

  describe('Valid Events', () => {
    it('should validate category view event', () => {
      const event: TrackingEventInput = {
        ...categoryViewEvent,
        eventType: TrackingEventType.VIEW,
      }
      expect(() => TrackingEventValidator.validate(event)).not.toThrow()
    })

    it('should validate category product display event', () => {
      const event: TrackingEventInput = {
        ...categoryProductDisplayEvent,
        eventType: TrackingEventType.DISPLAY,
      }
      expect(() => TrackingEventValidator.validate(event)).not.toThrow()
    })

    it('should validate search result view event', () => {
      const event: TrackingEventInput = {
        ...searchResultViewEvent,
        eventType: TrackingEventType.SEARCH,
      }
      expect(() => TrackingEventValidator.validate(event)).not.toThrow()
    })

    it('should validate search product display event', () => {
      const event: TrackingEventInput = {
        ...searchProductDisplayEvent,
        eventType: TrackingEventType.DISPLAY,
      }
      expect(() => TrackingEventValidator.validate(event)).not.toThrow()
    })

    it('should validate product view event', () => {
      const event: TrackingEventInput = {
        ...productViewEvent,
        eventType: TrackingEventType.VIEW,
      }
      expect(() => TrackingEventValidator.validate(event)).not.toThrow()
    })

    it('should validate add to cart product event', () => {
      const event: TrackingEventInput = {
        ...addToCartProductEvent,
        eventType: TrackingEventType.ADD_TO_CART,
      }
      expect(() => TrackingEventValidator.validate(event)).not.toThrow()
    })

    it('should validate order product event', () => {
      const event: TrackingEventInput = {
        ...orderProductEvent,
        eventType: TrackingEventType.ORDER,
      }
      expect(() => TrackingEventValidator.validate(event)).not.toThrow()
    })
  })

  // =========================================================================
  // Invalid events — should fail validation with specific error messages
  // =========================================================================

  describe('Invalid Events', () => {
    it('should reject view event missing entityCode', () => {
      const event: TrackingEventInput = {
        ...invalidViewMissingEntityCode,
        eventType: TrackingEventType.VIEW,
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'entityCode is required for view event'
      )
    })

    it('should reject category view event missing payload.product_list', () => {
      const event: TrackingEventInput = {
        ...invalidCategoryViewMissingProductList,
        eventType: TrackingEventType.VIEW,
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.product_list is required for view event'
      )
    })

    it('should reject display event missing context info', () => {
      const event: TrackingEventInput = {
        ...invalidDisplayMissingContext,
        eventType: TrackingEventType.DISPLAY,
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'contextType is required for display event'
      )
    })

    it('should reject display event with empty items array', () => {
      const event: TrackingEventInput = {
        ...invalidDisplayEmptyItems,
        eventType: TrackingEventType.DISPLAY,
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.items must be of type non-empty-array for display event'
      )
    })

    it('should reject search event missing payload.search_query', () => {
      const event: TrackingEventInput = {
        ...invalidSearchMissingSearchQuery,
        eventType: TrackingEventType.SEARCH,
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.search_query is required for search event'
      )
    })

    it('should reject add_to_cart event missing entityCode', () => {
      const event: TrackingEventInput = {
        ...invalidAddToCartMissingEntityCode,
        eventType: TrackingEventType.ADD_TO_CART,
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'entityCode is required for add_to_cart event'
      )
    })

    it('should reject order event missing payload.order', () => {
      const event: TrackingEventInput = {
        ...invalidOrderMissingOrder,
        eventType: TrackingEventType.ORDER,
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.order is required for order event'
      )
    })
  })

  // =========================================================================
  // Deep structure validation tests
  // =========================================================================

  describe('Payload Structure Validation', () => {
    it('should validate product_list structure in category view', () => {
      const event: TrackingEventInput = {
        ...categoryViewEvent,
        eventType: TrackingEventType.VIEW,
        payload: JSON.stringify({
          product_list: {
            item_count: 'not-a-number', // Invalid: should be integer
            current_page: 1,
            page_count: 1,
            sort_order: 'position',
            sort_direction: 'asc',
            filters: [],
          },
        }),
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.product_list.item_count must be of type integer'
      )
    })

    it('should validate search_query structure', () => {
      const event: TrackingEventInput = {
        ...searchResultViewEvent,
        eventType: TrackingEventType.SEARCH,
        payload: JSON.stringify({
          search_query: {
            // Missing query_text
            is_spellchecked: false,
          },
          product_list: {
            item_count: 5,
            current_page: 1,
            page_count: 1,
            sort_order: 'position',
            sort_direction: 'asc',
            filters: [],
          },
        }),
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.search_query.query_text is required'
      )
    })

    it('should validate display items structure', () => {
      const event: TrackingEventInput = {
        ...categoryProductDisplayEvent,
        eventType: TrackingEventType.DISPLAY,
        payload: JSON.stringify({
          items: [
            {
              entityCode: 'SDK-SHOE-001',
              display: {
                position: 'not-a-number', // Invalid: should be integer
              },
            },
          ],
        }),
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.items[0].display.position must be of type integer'
      )
    })

    it('should validate cart structure in add_to_cart event', () => {
      const event: TrackingEventInput = {
        ...addToCartProductEvent,
        eventType: TrackingEventType.ADD_TO_CART,
        payload: JSON.stringify({
          cart: {
            qty: 'not-a-number', // Invalid: should be numeric
          },
        }),
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.cart.qty must be of type numeric'
      )
    })

    it('should validate order structure in order event', () => {
      const event: TrackingEventInput = {
        ...orderProductEvent,
        eventType: TrackingEventType.ORDER,
        payload: JSON.stringify({
          order: {
            order_id: '125',
            // Missing total field
          },
          items: [
            { entityCode: 'SDK-SHOE-001', order: { price: 129.99, qty: 1, row_total: 129.99 } },
          ],
        }),
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.order.total is required'
      )
    })

    it('should validate order items structure', () => {
      const event: TrackingEventInput = {
        ...orderProductEvent,
        eventType: TrackingEventType.ORDER,
        payload: JSON.stringify({
          order: {
            order_id: '125',
            total: 309.97,
          },
          items: [
            {
              entityCode: 'SDK-SHOE-001',
              order: {
                price: 129.99,
                qty: 1,
                // Missing row_total
              },
            },
          ],
        }),
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload.items[0].order.row_total is required'
      )
    })
  })

  // =========================================================================
  // Edge cases
  // =========================================================================

  describe('Edge Cases', () => {
    it('should reject invalid JSON payload', () => {
      const event: TrackingEventInput = {
        ...categoryViewEvent,
        eventType: TrackingEventType.VIEW,
        payload: 'not-valid-json{',
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'payload must be a valid JSON string'
      )
    })

    it('should allow product view without payload', () => {
      const event: TrackingEventInput = {
        ...productViewEvent,
        eventType: TrackingEventType.VIEW,
        payload: undefined,
      }
      expect(() => TrackingEventValidator.validate(event)).not.toThrow()
    })

    it('should reject unsupported event type', () => {
      const event: TrackingEventInput = {
        ...productViewEvent,
        eventType: 'UNSUPPORTED' as TrackingEventType,
      }
      expect(() => TrackingEventValidator.validate(event)).toThrow(
        'Unsupported event type'
      )
    })
  })
})
