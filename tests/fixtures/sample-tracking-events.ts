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

const SESSION_UID = '2a9c9f2d-0aff-5c1c-b0a8-98cb6460a1d2'
const SESSION_VID = '55779ebd-9f1f-3ca8-dabf-0d2d83306f32'
const LOCALIZED_CATALOG_CODE_FR = 'sdk_test_shop_fr'
const LOCALIZED_CATALOG_CODE_EN = 'sdk_test_shop_en'

// ---------------------------------------------------------------------------
// categoryView — view event on a category page with product_list payload
// ---------------------------------------------------------------------------

export const categoryViewEvent: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'category',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  entityCode: 'cat_shoes',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({
    product_list: {
      item_count: 5,
      current_page: 1,
      page_count: 1,
      sort_order: 'position',
      sort_direction: 'asc',
      filters: [
        { name: 'fashion_material__value', value: '47' },
      ],
    },
  }),
}

// ---------------------------------------------------------------------------
// categoryProductDisplay — display event for products in a category context
// ---------------------------------------------------------------------------

export const categoryProductDisplayEvent: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'category',
  contextType: 'category',
  contextCode: 'cat_shoes',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({
    items: [
      { entityCode: 'SDK-SHOE-001', display: { position: 1 } },
      { entityCode: 'SDK-SHOE-002', display: { position: 2 } },
      { entityCode: 'SDK-SHOE-003', display: { position: 3 } },
    ],
  }),
}

// ---------------------------------------------------------------------------
// searchResultView — search event with search_query and product_list payload
// ---------------------------------------------------------------------------

export const searchResultViewEvent: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
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
      filters: [
        { name: 'fashion_material__value', value: '47' },
      ],
    },
  }),
}

// ---------------------------------------------------------------------------
// searchProductDisplay — display event for products in a search context
// ---------------------------------------------------------------------------

export const searchProductDisplayEvent: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.SEARCH,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({
    items: [
      { entityCode: 'SDK-SHOE-001', display: { position: 1 } },
      { entityCode: 'SDK-SHOE-002', display: { position: 2 } },
      { entityCode: 'SDK-SHOE-003', display: { position: 3 } },
    ],
  }),
}

// ---------------------------------------------------------------------------
// productView — view event on a product page with source/context info
// ---------------------------------------------------------------------------

export const productViewEvent: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  entityCode: 'SDK-SHOE-001',
  sourceEventType: TrackingEventType.SEARCH,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
}

// ---------------------------------------------------------------------------
// addToCartProduct — add_to_cart event with cart qty payload
// ---------------------------------------------------------------------------

export const addToCartProductEvent: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  entityCode: 'SDK-SHOE-001',
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({
    cart: { qty: 2 },
  }),
}

// ---------------------------------------------------------------------------
// orderProduct — order event with order details and items array
// ---------------------------------------------------------------------------

export const orderProductEvent: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({
    order: {
      order_id: '125',
      total: 309.97,
    },
    items: [
      { entityCode: 'SDK-SHOE-001', order: { price: 129.99, qty: 1, row_total: 129.99 } },
      { entityCode: 'SDK-SHOE-002', order: { price: 179.99, qty: 1, row_total: 179.99 } },
    ],
  }),
}

// ---------------------------------------------------------------------------
// Invalid inputs — for validation rejection tests
// ---------------------------------------------------------------------------

/** View event missing entityCode */
export const invalidViewMissingEntityCode: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'category',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
}

/** Category view event with payload missing product_list */
export const invalidCategoryViewMissingProductList: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'category',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  entityCode: 'cat_shoes',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({}),
}

/** Display event missing context info */
export const invalidDisplayMissingContext: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({
    items: [{ entityCode: 'SDK-SHOE-001', display: { position: 1 } }],
  }),
}

/** Display event with empty items array */
export const invalidDisplayEmptyItems: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'category',
  contextType: 'category',
  contextCode: 'cat_shoes',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({ items: [] }),
}

/** Search event missing payload.search_query */
export const invalidSearchMissingSearchQuery: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({
    product_list: { item_count: 1 },
  }),
}

/** Add to cart event missing entityCode */
export const invalidAddToCartMissingEntityCode: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({ cart: { qty: 2 } }),
}

/** Order event missing payload.order */
export const invalidOrderMissingOrder: Omit<TrackingEventInput, 'eventType'> = {
  metadataCode: 'product',
  localizedCatalogCode: LOCALIZED_CATALOG_CODE_FR,
  sourceEventType: TrackingEventType.VIEW,
  sourceMetadataCode: 'product',
  contextType: 'search',
  contextCode: 'shoe',
  sessionUid: SESSION_UID,
  sessionVid: SESSION_VID,
  payload: JSON.stringify({
    items: [{ entityCode: 'SDK-SHOE-001', order: { price: 129.99 } }],
  }),
}
