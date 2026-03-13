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

import { Client, Configuration, TokenCacheManager, TrackingEventValidator } from '@gally/sdk'

enum TrackingEventType {
  VIEW = 'view',
  DISPLAY = 'display',
  SEARCH = 'search',
  ADD_TO_CART = 'add_to_cart',
  ORDER = 'order',
}

/**
 * Common tracking event properties.
 * Shared between input and API response.
 */
interface TrackingEventBase {
  eventType: TrackingEventType
  metadataCode: string
  localizedCatalogCode: string
  entityCode?: string
  sourceEventType?: TrackingEventType
  sourceMetadataCode?: string
  contextType?: string
  contextCode?: string
  sessionUid: string
  sessionVid: string
  payload?: string
}

/**
 * TrackingEvent input type.
 * Matches the Gally createTrackingEvent GraphQL mutation input.
 */
type TrackingEventInput = TrackingEventBase

/**
 * TrackingEvent result type.
 * Returned by the Gally API after creating a tracking event.
 */
interface TrackingEventResponse extends TrackingEventBase {
  id: string
  '@context': string
  '@id': string
  '@type': string
  createdAt: string
}

/**
 * Tracking event manager service.
 *
 * Provides methods to push tracking events (view, display, search,
 * add_to_cart, order) to the Gally API via GraphQL mutations.
 */
class TrackingEventManager {
  protected readonly client: Client

  constructor(
    configuration: Configuration,
    tokenCacheManager?: TokenCacheManager,
  ) {
    this.client = new Client(configuration, tokenCacheManager)
  }

  /**
   * Push a tracking event to the Gally API.
   * Validates the input before sending.
   */
  async pushEvent(input: TrackingEventInput): Promise<TrackingEventResponse> {
    TrackingEventValidator.validate(input)

    const query = `
      mutation createTrackingEvent($input: createTrackingEventInput!) {
        createTrackingEvent(input: $input) {
          trackingEvent { id }
        }
      }
    `
    const response = await this.client.graphql(query, { input }, {}, false)
    return response.data?.createTrackingEvent?.trackingEvent as TrackingEventResponse
  }

  async pushViewEvent(
    params: Omit<TrackingEventInput, 'eventType'>,
  ): Promise<TrackingEventResponse> {
    return this.pushEvent({ ...params, eventType: TrackingEventType.VIEW })
  }

  async pushDisplayEvent(
    params: Omit<TrackingEventInput, 'eventType'>,
  ): Promise<TrackingEventResponse> {
    return this.pushEvent({ ...params, eventType: TrackingEventType.DISPLAY })
  }

  async pushSearchEvent(
    params: Omit<TrackingEventInput, 'eventType'>,
  ): Promise<TrackingEventResponse> {
    return this.pushEvent({ ...params, eventType: TrackingEventType.SEARCH })
  }

  async pushAddToCartEvent(
    params: Omit<TrackingEventInput, 'eventType'>,
  ): Promise<TrackingEventResponse> {
    return this.pushEvent({ ...params, eventType: TrackingEventType.ADD_TO_CART })
  }

  async pushOrderEvent(
    params: Omit<TrackingEventInput, 'eventType'>,
  ): Promise<TrackingEventResponse> {
    return this.pushEvent({ ...params, eventType: TrackingEventType.ORDER })
  }
}

export { TrackingEventType, TrackingEventManager }
export type { TrackingEventInput, TrackingEventResponse }
