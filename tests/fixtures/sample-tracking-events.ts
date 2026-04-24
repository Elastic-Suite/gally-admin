/**
 * Tracking event fixtures for integration tests.
 *
 * Each entry mirrors a test case from the PHP TrackingEventTest data provider
 * in gally-standard (src/Tracker/Tests/Api/GraphQl/TrackingEventTest.php).
 *
 * Structure:
 *   - Shared session/catalog constants (aligned with sample-data.ts)
 *   - One named export per event scenario (valid inputs)
 *   - One named export grouping invalid inputs for validation tests
 */

import { TrackingEventType, TrackingEventInput } from '@gally/sdk'

// ---------------------------------------------------------------------------
// Shared constants (aligned with sample-data.ts)
// ---------------------------------------------------------------------------

const LOCALIZED_CATALOG_CODE_FR = 'sdk_test_shop_fr'
const LOCALIZED_CATALOG_CODE_EN = 'sdk_test_shop_en'

// ---------------------------------------------------------------------------
// categoryView — view event on a category page with product_list payload
// ---------------------------------------------------------------------------

export const categoryViewEvent: TrackingEventInput = {
  eventType: TrackingEventType.VIEW,
  metadataCode: 'category',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  entityCode: 'cat_shoes',
  payload: JSON.stringify({
    product_list: {
      item_count: 5,
      current_page: 1,
      page_count: 1,
      sort_order: 'position',
      sort_direction: 'asc',
      filters: [{ name: 'fashion_material__value', value: '47' }],
    },
  }),
}

// ---------------------------------------------------------------------------
// categoryProductDisplay — display event for products in a category context
// ---------------------------------------------------------------------------

export const categoryProductDisplayEvent: TrackingEventInput = {
  eventType: TrackingEventType.DISPLAY,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'category',
  contextType: 'category',
  contextCode: 'cat_shoes',
  payload: JSON.stringify({
    items: [
      { entityCode: 'SDK-SHOE-001', display: { position: 0 } },
      { entityCode: 'SDK-SHOE-002', display: { position: 1 } },
      { entityCode: 'SDK-SHOE-003', display: { position: 2 } },
    ],
  }),
}

// ---------------------------------------------------------------------------
// searchResultView — search event with search_query and product_list payload
// ---------------------------------------------------------------------------

export const searchResultViewEvent: TrackingEventInput = {
  eventType: TrackingEventType.SEARCH,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
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
      filters: [{ name: 'fashion_material__value', value: '47' }],
    },
  }),
}

// ---------------------------------------------------------------------------
// searchProductDisplay — display event for products in a search context
// ---------------------------------------------------------------------------

export const searchProductDisplayEvent: TrackingEventInput = {
  eventType: TrackingEventType.DISPLAY,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.SEARCH,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  payload: JSON.stringify({
    items: [
      { entityCode: 'SDK-SHOE-001', display: { position: 0 } },
      { entityCode: 'SDK-SHOE-002', display: { position: 1 } },
      { entityCode: 'SDK-SHOE-003', display: { position: 2 } },
    ],
  }),
}

// ---------------------------------------------------------------------------
// productView — view event on a product page with source/context info
// ---------------------------------------------------------------------------

export const productViewEvent: TrackingEventInput = {
  eventType: TrackingEventType.VIEW,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  entityCode: 'SDK-SHOE-001',
  sourceEventType: TrackingEventType.SEARCH,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
}

// ---------------------------------------------------------------------------
// addToCartProduct — add_to_cart event with cart qty payload
// ---------------------------------------------------------------------------

export const addToCartProductEvent: TrackingEventInput = {
  eventType: TrackingEventType.ADD_TO_CART,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  entityCode: 'SDK-SHOE-001',
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  payload: JSON.stringify({
    child_sku: 'SDK-SHOE-001-RED',
    cart: {
      qty: 2,
    },
  }),
}

// ---------------------------------------------------------------------------
// orderProduct — order event with order details and items array
// ---------------------------------------------------------------------------

export const orderProductEvent: TrackingEventInput = {
  eventType: TrackingEventType.ORDER,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  payload: JSON.stringify({
    order: {
      order_id: '125',
      total: 309.97,
    },
    items: [
      {
        entityCode: 'SDK-SHOE-001',
        child_sku: 'SDK-SHOE-001-RED',
        order: {
          price: 129.99,
          qty: 1,
          row_total: 129.99,
        },
      },
      {
        entityCode: 'SDK-SHOE-002',
        child_sku: 'SDK-SHOE-002-BLUE',
        order: {
          price: 179.99,
          qty: 1,
          row_total: 179.99,
        },
      },
    ],
  }),
}

// ---------------------------------------------------------------------------
// English catalog events — to differentiate from French catalog tests
// ---------------------------------------------------------------------------

/** Product view event for English catalog */
export const productViewEventEN: TrackingEventInput = {
  eventType: TrackingEventType.VIEW,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_EN,
  entityCode: 'SDK-SHOE-001',
  sourceEventType: TrackingEventType.SEARCH,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoes',
}

/** Search result view event for English catalog */
export const searchResultViewEventEN: TrackingEventInput = {
  eventType: TrackingEventType.SEARCH,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_EN,
  payload: JSON.stringify({
    search_query: {
      is_spellchecked: false,
      query_text: 'shoes',
    },
    product_list: {
      item_count: 3,
      current_page: 1,
      page_count: 1,
      sort_order: 'relevance',
      sort_direction: 'desc',
      filters: [],
    },
  }),
}

/** Add to cart event for English catalog */
export const addToCartProductEventEN: TrackingEventInput = {
  eventType: TrackingEventType.ADD_TO_CART,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_EN,
  entityCode: 'SDK-SHOE-002',
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'category',
  contextCode: 'cat_shoes',
  payload: JSON.stringify({
    child_sku: 'SDK-SHOE-002-BLUE',
    cart: {
      qty: 1,
    },
  }),
}

/** Search product display event for English catalog */
export const searchProductDisplayEventEN: TrackingEventInput = {
  eventType: TrackingEventType.DISPLAY,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_EN,
  sourceEventType: TrackingEventType.SEARCH,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoes',
  payload: JSON.stringify({
    items: [
      { entityCode: 'SDK-SHOE-001', display: { position: 0 } },
      { entityCode: 'SDK-SHOE-002', display: { position: 1 } },
    ],
  }),
}

// ---------------------------------------------------------------------------
// Invalid inputs — for validation rejection tests
// ---------------------------------------------------------------------------

/** View event missing entityCode */
export const invalidViewMissingEntityCode: TrackingEventInput = {
  eventType: TrackingEventType.VIEW,
  metadataCode: 'category',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
}

/** Category view event with payload missing product_list */
export const invalidCategoryViewMissingProductList: TrackingEventInput = {
  eventType: TrackingEventType.VIEW,
  metadataCode: 'category',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  entityCode: 'cat_shoes',
  payload: JSON.stringify({}),
}

/** Display event missing context info */
export const invalidDisplayMissingContext: TrackingEventInput = {
  eventType: TrackingEventType.DISPLAY,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  payload: JSON.stringify({
    items: [{ entityCode: 'SDK-SHOE-001', display: { position: 0 } }],
  }),
}

/** Display event with empty items array */
export const invalidDisplayEmptyItems: TrackingEventInput = {
  eventType: TrackingEventType.DISPLAY,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'category',
  contextType: 'category',
  contextCode: 'cat_shoes',
  payload: JSON.stringify({ items: [] }),
}

/** Search event missing payload.search_query */
export const invalidSearchMissingSearchQuery: TrackingEventInput = {
  eventType: TrackingEventType.SEARCH,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  payload: JSON.stringify({
    product_list: { item_count: 1 },
  }),
}

/** Add to cart event missing entityCode */
export const invalidAddToCartMissingEntityCode: TrackingEventInput = {
  eventType: TrackingEventType.ADD_TO_CART,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  payload: JSON.stringify({ cart: { qty: 2 } }),
}

/** Order event missing payload.order */
export const invalidOrderMissingOrder: TrackingEventInput = {
  eventType: TrackingEventType.ORDER,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  payload: JSON.stringify({
    items: [{ entityCode: 'SDK-SHOE-001', order: { price: 129.99 } }],
  }),
}

/** Add to cart event missing child_sku */
export const invalidAddToCartMissingChildSku: TrackingEventInput = {
  eventType: TrackingEventType.ADD_TO_CART,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  entityCode: 'SDK-SHOE-001',
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  payload: JSON.stringify({
    cart: { qty: 2 },
  }),
}

/** Order event missing child_sku in items */
export const invalidOrderMissingChildSku: TrackingEventInput = {
  eventType: TrackingEventType.ORDER,
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  payload: JSON.stringify({
    order: { order_id: '123', total: 100 },
    items: [
      {
        entityCode: 'SDK-SHOE-001',
        order: { price: 100, qty: 1, row_total: 100 },
      },
    ],
  }),
}
