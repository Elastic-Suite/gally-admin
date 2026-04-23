/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2024-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

import { TrackingEventInput } from '../service'

export enum TrackingEventType {
  VIEW = 'view',
  DISPLAY = 'display',
  SEARCH = 'search',
  ADD_TO_CART = 'add_to_cart',
  ORDER = 'order',
}

// ---------------------------------------------------------------------------
// Payload shape descriptors
// ---------------------------------------------------------------------------

interface PayloadFieldRule {
  type:
    | 'string'
    | 'numeric'
    | 'integer'
    | 'boolean'
    | 'object'
    | 'array'
    | 'non-empty-array'
  required?: boolean
  fields?: Record<string, PayloadFieldRule>
  items?: Record<string, PayloadFieldRule>
}

/**
 * Validation rules config for each event type.
 *
 * - extraFields:            additional top-level required fields (on top of common ones)
 * - payloadShapeByMetadata: deep format validation rules (presence + type + structure)
 *                           that depend on `metadataCode`
 */
interface EventValidationRule {
  extraFields?: string[]
  payloadShapeByMetadata?: Record<string, Record<string, PayloadFieldRule>>
}

const COMMON_REQUIRED_FIELDS: string[] = [
  'metadataCode',
  'localizedCatalogCode',
  'sessionUid',
  'sessionVid',
]

const SOURCE_CONTEXT_FIELDS: string[] = [
  'contextType',
  'contextCode',
  'sourceEventType',
  'sourceMetadataCode',
]

// ---------------------------------------------------------------------------
// Shared payload format rules
// ---------------------------------------------------------------------------

/**
 * Format for filter items in product_list.filters array.
 */
const FILTER_ITEM_FORMAT: Record<string, PayloadFieldRule> = {
  name: { type: 'string', required: true },
  value: { type: 'string', required: true },
}

/**
 * Format for product_list object in category view and search result events.
 */
const PRODUCT_LIST_FORMAT: Record<string, PayloadFieldRule> = {
  product_list: {
    type: 'object',
    required: true,
    fields: {
      item_count: { type: 'integer', required: true },
      current_page: { type: 'integer', required: true },
      page_count: { type: 'integer', required: true },
      sort_order: { type: 'string', required: true },
      sort_direction: { type: 'string', required: true },
      filters: { type: 'array', required: true, items: FILTER_ITEM_FORMAT },
    },
  },
}

/**
 * Format for search_query object in search events.
 */
const SEARCH_QUERY_FORMAT: Record<string, PayloadFieldRule> = {
  search_query: {
    type: 'object',
    required: true,
    fields: {
      is_spellchecked: { type: 'boolean', required: true },
      query_text: { type: 'string', required: true },
    },
  },
}

/**
 * Format for display.position nested in items array for display events.
 */
const DISPLAY_POSITION_FORMAT: Record<string, PayloadFieldRule> = {
  position: { type: 'integer', required: true },
}

/**
 * Format for items in display events (product impressions).
 */
const DISPLAY_ITEM_FORMAT: Record<string, PayloadFieldRule> = {
  entityCode: { type: 'string', required: true },
  display: {
    type: 'object',
    required: true,
    fields: DISPLAY_POSITION_FORMAT,
  },
}

/**
 * Format for cart object in add_to_cart events.
 */
const CART_FORMAT: Record<string, PayloadFieldRule> = {
  cart: {
    type: 'object',
    required: true,
    fields: {
      child_sku: { type: 'string', required: true },
      qty: { type: 'numeric', required: true },
    },
  },
}

/**
 * Format for top-level order object in order events.
 */
const ORDER_OBJECT_FORMAT: Record<string, PayloadFieldRule> = {
  order: {
    type: 'object',
    required: true,
    fields: {
      order_id: { type: 'string', required: true },
      total: { type: 'numeric', required: true },
    },
  },
}

/**
 * Format for order details nested in items array for order events.
 */
const ORDER_ITEM_ORDER_FORMAT: Record<string, PayloadFieldRule> = {
  child_sku: { type: 'string', required: true },
  price: { type: 'numeric', required: true },
  qty: { type: 'numeric', required: true },
  row_total: { type: 'numeric', required: true },
}

/**
 * Format for items in order events (purchased products).
 */
const ORDER_ITEM_FORMAT: Record<string, PayloadFieldRule> = {
  entityCode: { type: 'string', required: true },
  order: {
    type: 'object',
    required: true,
    fields: ORDER_ITEM_ORDER_FORMAT,
  },
}

// ---------------------------------------------------------------------------
// Validation rules per event type
// ---------------------------------------------------------------------------

const VALIDATION_RULES: Record<TrackingEventType, EventValidationRule> = {
  [TrackingEventType.VIEW]: {
    extraFields: ['entityCode'],
    payloadShapeByMetadata: {
      category: PRODUCT_LIST_FORMAT,
    },
  },
  [TrackingEventType.DISPLAY]: {
    extraFields: ['payload', ...SOURCE_CONTEXT_FIELDS],
    payloadShapeByMetadata: {
      '*': {
        items: {
          type: 'non-empty-array',
          required: true,
          items: DISPLAY_ITEM_FORMAT,
        },
      },
    },
  },
  [TrackingEventType.SEARCH]: {
    extraFields: ['payload'],
    payloadShapeByMetadata: {
      '*': SEARCH_QUERY_FORMAT,
      product: {
        ...SEARCH_QUERY_FORMAT,
        ...PRODUCT_LIST_FORMAT,
      },
    },
  },
  [TrackingEventType.ADD_TO_CART]: {
    extraFields: ['entityCode', 'payload', ...SOURCE_CONTEXT_FIELDS],
    payloadShapeByMetadata: {
      '*': CART_FORMAT,
    },
  },
  [TrackingEventType.ORDER]: {
    extraFields: ['payload', ...SOURCE_CONTEXT_FIELDS],
    payloadShapeByMetadata: {
      '*': {
        ...ORDER_OBJECT_FORMAT,
        items: {
          type: 'non-empty-array',
          required: true,
          items: ORDER_ITEM_FORMAT,
        },
      },
    },
  },
}

export class TrackingEventValidator {
  /**
   * Validate a tracking event input against the rules for its event type.
   */
  static validate(input: TrackingEventInput): void {
    const rule = TrackingEventValidator.getRule(input.eventType)

    TrackingEventValidator.assertRequiredFields(input, rule)

    if (input.payload) {
      const payloadObj = TrackingEventValidator.parsePayload(input.payload)
      TrackingEventValidator.assertPayloadFormat(payloadObj, rule, input)
    }
  }

  // ---------------------------------------------------------------------------
  // Rule resolution
  // ---------------------------------------------------------------------------

  private static getRule(eventType: TrackingEventType): EventValidationRule {
    const rule = VALIDATION_RULES[eventType]
    if (!rule) {
      throw new Error(`Unsupported event type: ${eventType}`)
    }
    return rule
  }

  // ---------------------------------------------------------------------------
  // Top-level field validation
  // ---------------------------------------------------------------------------

  private static assertRequiredFields(
    input: TrackingEventInput,
    rule: EventValidationRule,
  ): void {
    const allFields = [...COMMON_REQUIRED_FIELDS, ...(rule.extraFields ?? [])]

    for (const field of allFields) {
      const value = input[field as keyof TrackingEventInput]
      if (value === undefined || value === '') {
        throw new Error(`${field} is required for ${input.eventType} event`)
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Payload parsing
  // ---------------------------------------------------------------------------

  private static parsePayload(payload: string): Record<string, unknown> {
    try {
      return JSON.parse(payload)
    } catch {
      throw new Error('payload must be a valid JSON string')
    }
  }

  // ---------------------------------------------------------------------------
  // Deep payload format validation (presence + type + structure, metadata-dependent)
  // ---------------------------------------------------------------------------

  private static assertPayloadFormat(
    payloadObj: Record<string, unknown>,
    rule: EventValidationRule,
    input: TrackingEventInput,
  ): void {
    const formatRules =
      rule.payloadShapeByMetadata?.[input.metadataCode] ??
      rule.payloadShapeByMetadata?.['*']

    if (!formatRules) return

    for (const [field, fieldRule] of Object.entries(formatRules)) {
      TrackingEventValidator.validateField(
        payloadObj,
        field,
        fieldRule,
        `payload.${field}`,
        input.eventType,
      )
    }
  }

  /**
   * Validate a single field: check if required, then validate its format recursively.
   */
  private static validateField(
    parent: Record<string, unknown>,
    fieldName: string,
    rule: PayloadFieldRule,
    path: string,
    eventType: TrackingEventType,
  ): void {
    const value = parent[fieldName]

    if (value === undefined) {
      if (rule.required) {
        throw new Error(`${path} is required for ${eventType} event`)
      }
      return
    }

    TrackingEventValidator.assertFieldFormat(value, rule, path, eventType)
  }

  /**
   * Recursively validate the format of a field value.
   * Checks type, nested fields, and array items.
   */
  private static assertFieldFormat(
    value: unknown,
    rule: PayloadFieldRule,
    path: string,
    eventType: TrackingEventType,
  ): void {
    TrackingEventValidator.assertFieldType(value, rule.type, path, eventType)

    if (
      rule.fields &&
      ['object', 'array', 'non-empty-array'].includes(rule.type)
    ) {
      TrackingEventValidator.validateNestedFields(
        value,
        rule.fields,
        path,
        eventType,
      )
    }

    if (rule.items && ['array', 'non-empty-array'].includes(rule.type)) {
      TrackingEventValidator.validateArrayItems(
        value,
        rule.items,
        path,
        eventType,
      )
    }
  }

  /**
   * Validate nested object fields.
   */
  private static validateNestedFields(
    value: unknown,
    fields: Record<string, PayloadFieldRule>,
    path: string,
    eventType: TrackingEventType,
  ): void {
    const obj = value as Record<string, unknown>

    for (const [fieldName, fieldRule] of Object.entries(fields)) {
      TrackingEventValidator.validateField(
        obj,
        fieldName,
        fieldRule,
        `${path}.${fieldName}`,
        eventType,
      )
    }
  }

  /**
   * Validate array items against a schema.
   */
  private static validateArrayItems(
    value: unknown,
    itemSchema: Record<string, PayloadFieldRule>,
    path: string,
    eventType: TrackingEventType,
  ): void {
    const arr = value as unknown[]

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i] as Record<string, unknown>

      for (const [fieldName, fieldRule] of Object.entries(itemSchema)) {
        TrackingEventValidator.validateField(
          element,
          fieldName,
          fieldRule,
          `${path}[${i}].${fieldName}`,
          eventType,
        )
      }
    }
  }

  private static assertFieldType(
    value: unknown,
    type: PayloadFieldRule['type'],
    path: string,
    eventType: TrackingEventType,
  ): void {
    const validators: Record<
      PayloadFieldRule['type'],
      (v: unknown) => boolean
    > = {
      string: (v) => typeof v === 'string',
      numeric: (v) => typeof v === 'number' && !isNaN(v),
      integer: (v) => typeof v === 'number' && Number.isInteger(v),
      boolean: (v) => typeof v === 'boolean',
      object: (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
      array: (v) => Array.isArray(v),
      'non-empty-array': (v) => Array.isArray(v) && v.length > 0,
    }

    const typeNames: Record<PayloadFieldRule['type'], string> = {
      string: 'string',
      numeric: 'numeric',
      integer: 'integer',
      boolean: 'boolean',
      object: 'object',
      array: 'array',
      'non-empty-array': 'a non-empty array',
    }

    if (!validators[type](value)) {
      const typeName = typeNames[type] || type
      const article = typeName.startsWith('a ') ? '' : 'of type '
      throw new Error(
        `${path} must be ${article}${typeName} for ${eventType} event`,
      )
    }
  }
}
