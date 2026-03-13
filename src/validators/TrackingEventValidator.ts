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

import { TrackingEventInput, TrackingEventType } from '@gally/sdk'

/**
 * Validation rules config for each event type.
 *
 * - extraFields:            additional top-level required fields (on top of common ones)
 * - payloadFields:          required keys inside the parsed payload JSON object
 * - payloadArrayFields:     required keys inside the parsed payload that must be non-empty arrays
 * - payloadFieldsByMetadata: required payload keys that depend on `metadataCode` value
 */
interface EventValidationRule {
  extraFields?: string[]
  payloadFields?: string[]
  payloadArrayFields?: string[]
  payloadFieldsByMetadata?: Record<string, string[]>
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

const VALIDATION_RULES: Record<TrackingEventType, EventValidationRule> = {
  [TrackingEventType.VIEW]: {
    extraFields: ['entityCode'],
    payloadFieldsByMetadata: { category: ['product_list'] },
  },
  [TrackingEventType.DISPLAY]: {
    extraFields: ['payload', ...SOURCE_CONTEXT_FIELDS],
    payloadArrayFields: ['items'],
  },
  [TrackingEventType.SEARCH]: {
    extraFields: ['payload'],
    payloadFields: ['search_query', 'product_list'],
  },
  [TrackingEventType.ADD_TO_CART]: {
    extraFields: ['entityCode', 'payload', ...SOURCE_CONTEXT_FIELDS],
    payloadFields: ['cart'],
  },
  [TrackingEventType.ORDER]: {
    extraFields: ['payload', ...SOURCE_CONTEXT_FIELDS],
    payloadFields: ['order'],
    payloadArrayFields: ['items'],
  },
}

export class TrackingEventValidator {
  /**
   * Validate a tracking event input against the rules for its event type.
   */
  static validate(input: TrackingEventInput): void {
    const rule = TrackingEventValidator.getRule(input.eventType)
    const allRequiredFields = TrackingEventValidator.buildRequiredFields(rule)

    TrackingEventValidator.assertRequiredFields(input, allRequiredFields)

    if (input.payload) {
      const payloadObj = TrackingEventValidator.parsePayload(input.payload)
      TrackingEventValidator.assertPayloadFields(payloadObj, rule, input.eventType)
      TrackingEventValidator.assertPayloadArrayFields(payloadObj, rule, input.eventType)
      TrackingEventValidator.assertPayloadFieldsByMetadata(payloadObj, rule, input)
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

  private static buildRequiredFields(rule: EventValidationRule): string[] {
    return [...COMMON_REQUIRED_FIELDS, ...(rule.extraFields ?? [])]
  }

  private static assertRequiredFields(
    input: TrackingEventInput,
    fields: string[],
  ): void {
    for (const field of fields) {
      TrackingEventValidator.assertFieldPresent(input, field)
    }
  }

  private static assertFieldPresent(
    input: TrackingEventInput,
    field: string,
  ): void {
    const value = input[field as keyof TrackingEventInput]
    if (value === undefined || value === '') {
      throw new Error(`${field} is required for ${input.eventType} event`)
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
  // Payload required-key validation
  // ---------------------------------------------------------------------------

  private static assertPayloadFields(
    payloadObj: Record<string, unknown>,
    rule: EventValidationRule,
    eventType: TrackingEventType,
  ): void {
    if (!rule.payloadFields) return

    for (const field of rule.payloadFields) {
      TrackingEventValidator.assertPayloadKeyPresent(payloadObj, field, eventType)
    }
  }

  private static assertPayloadKeyPresent(
    payloadObj: Record<string, unknown>,
    field: string,
    eventType: TrackingEventType,
  ): void {
    if (payloadObj[field] === undefined) {
      throw new Error(`payload.${field} is required for ${eventType} event`)
    }
  }

  // ---------------------------------------------------------------------------
  // Payload required-array validation
  // ---------------------------------------------------------------------------

  private static assertPayloadArrayFields(
    payloadObj: Record<string, unknown>,
    rule: EventValidationRule,
    eventType: TrackingEventType,
  ): void {
    if (!rule.payloadArrayFields) return

    for (const field of rule.payloadArrayFields) {
      TrackingEventValidator.assertPayloadKeyIsNonEmptyArray(payloadObj, field, eventType)
    }
  }

  private static assertPayloadKeyIsNonEmptyArray(
    payloadObj: Record<string, unknown>,
    field: string,
    eventType: TrackingEventType,
  ): void {
    if (!Array.isArray(payloadObj[field]) || payloadObj[field].length < 1) {
      throw new Error(`payload.${field} must be a non-empty array for ${eventType} event`)
    }
  }

  // ---------------------------------------------------------------------------
  // Payload metadata-dependent validation (e.g. category view → product_list)
  // ---------------------------------------------------------------------------

  private static assertPayloadFieldsByMetadata(
    payloadObj: Record<string, unknown>,
    rule: EventValidationRule,
    input: TrackingEventInput,
  ): void {
    if (!rule.payloadFieldsByMetadata) return

    const metadataFields = rule.payloadFieldsByMetadata[input.metadataCode]
    if (!metadataFields) return

    for (const field of metadataFields) {
      TrackingEventValidator.assertPayloadKeyPresent(payloadObj, field, input.eventType)
    }
  }
}
