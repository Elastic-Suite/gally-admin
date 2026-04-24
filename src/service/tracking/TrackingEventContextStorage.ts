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

import { TrackingEventType } from '../../validator'
import type { TrackingEventInput } from '../TrackingEventManager'

type PartialTrackingEventContext = Pick<
  TrackingEventInput,
  'contextType' | 'contextCode'
>

type PartialTrackingEventSource = Pick<
  TrackingEventInput,
  'sourceEventType' | 'sourceMetadataCode'
>

type TrackingEventContext = PartialTrackingEventContext &
  PartialTrackingEventSource

type SearchPayload = Record<'search_query', { query_text: string }>

const TRACKING_CONTEXT_KEY = 'gally-tracking-context'

abstract class TrackingEventContextStorage {
  protected abstract get storage(): Storage

  isCategoryViewEvent(input: TrackingEventInput) {
    return (
      input?.eventType === TrackingEventType.VIEW &&
      ['category'].includes(input?.metadataCode)
    )
  }

  isSearchEvent(input: TrackingEventInput) {
    return input?.eventType === TrackingEventType.SEARCH
  }

  isUpdateContextEvent(input: TrackingEventInput) {
    return this.isCategoryViewEvent(input) || this.isSearchEvent(input)
  }

  getUpdatedEventContext(input: TrackingEventInput) {
    return {
      contextType: this.isSearchEvent(input) ? 'search' : 'category',
      contextCode: this.isSearchEvent(input)
        ? (JSON.parse(<string>input?.payload) as SearchPayload).search_query
            ?.query_text
        : input.entityCode,
    }
  }

  getSelfContext(
    input: TrackingEventInput,
  ): PartialTrackingEventContext | null {
    if (this.isUpdateContextEvent(input)) {
      return this.getUpdatedEventContext(input)
    }
    return null
  }

  isUpdateContextSourceEvent(input: TrackingEventInput) {
    return ![TrackingEventType.DISPLAY, TrackingEventType.ADD_TO_CART].includes(
      input?.eventType,
    )
  }

  checkAndUpdateContext(input: TrackingEventInput | null): boolean {
    if (!input) {
      return false
    }

    const existingContext = this.getTrackingContext()
    let newContext: TrackingEventContext =
      JSON.parse(JSON.stringify(existingContext)) ?? {}
    if (this.isUpdateContextEvent(input)) {
      newContext = { ...newContext, ...this.getUpdatedEventContext(input) }
    }

    if (this.isUpdateContextSourceEvent(input)) {
      newContext.sourceEventType = input.eventType
      newContext.sourceMetadataCode = input.metadataCode
    }

    const hasUpdatedContext =
      JSON.parse(JSON.stringify(existingContext)) !==
      JSON.parse(JSON.stringify(newContext))
    if (hasUpdatedContext) {
      this.storage.setItem(TRACKING_CONTEXT_KEY, JSON.stringify(newContext))
    }

    return hasUpdatedContext
  }

  getTrackingContext(): TrackingEventContext | null {
    const rawContext = this.storage.getItem(TRACKING_CONTEXT_KEY)
    if (!rawContext) {
      return null
    }

    try {
      const currentContext = JSON.parse(rawContext)
      return currentContext && Object.keys(currentContext).length > 0
        ? (currentContext as TrackingEventContext)
        : null
    } catch {
      return null
    }
  }
}

class TrackingEventContextSessionStorage extends TrackingEventContextStorage {
  protected get storage(): Storage {
    return sessionStorage
  }
}

class TrackingEventContextLocalStorage extends TrackingEventContextStorage {
  protected get storage(): Storage {
    return localStorage
  }
}

export {
  TrackingEventContextStorage,
  TrackingEventContextSessionStorage,
  TrackingEventContextLocalStorage,
}
export type { TrackingEventContext }
