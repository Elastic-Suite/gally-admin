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

import { Client, Configuration } from '../client'
import { TrackingEventValidator, TrackingEventType } from '../validator'

/**
 * Manages debouncing and throttling for event flushing.
 */
class ThrottledEventManager {
  private debounceTimer: NodeJS.Timeout | null = null
  private lastFlushTime: number = 0
  private readonly debounceMs: number
  private readonly throttleMs: number
  private flushCallback: (() => Promise<void>) | null = null

  constructor(debounceMs: number = 300, throttleMs: number = 1000) {
    this.debounceMs = debounceMs
    this.throttleMs = throttleMs
  }

  /**
   * Set the callback to be executed when flushing.
   */
  setFlushCallback(callback: () => Promise<void>): void {
    this.flushCallback = callback
  }

  /**
   * Schedule a flush with debouncing and throttling.
   */
  schedule(): void {
    // Clear existing debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    // Check if we should flush immediately due to throttle
    const timeSinceLastFlush = Date.now() - this.lastFlushTime
    const shouldFlushImmediately = timeSinceLastFlush >= this.throttleMs

    if (shouldFlushImmediately) {
      this.executeFlush()
    } else {
      // Schedule debounced flush
      this.debounceTimer = setTimeout(() => {
        this.executeFlush()
      }, this.debounceMs)
    }
  }

  /**
   * Execute the flush callback and update last flush time.
   */
  private async executeFlush(): Promise<void> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }

    this.lastFlushTime = Date.now()

    if (this.flushCallback) {
      await this.flushCallback()
    }
  }

  /**
   * Clear any pending timers.
   */
  clear(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
  }
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
 * Internal queue item for batched event processing.
 */
interface QueuedEvent {
  input: TrackingEventInput
  resolve: (value: TrackingEventResponse) => void
  reject: (reason?: unknown) => void
}

/**
 * Tracking event manager service.
 *
 * Provides methods to push tracking events (view, display, search,
 * add_to_cart, order) to the Gally API via GraphQL mutations.
 *
 * Features:
 * - Batches multiple events into a single GraphQL request
 * - Debounces rapid event submissions
 * - Throttles requests to avoid overwhelming the API
 */
class TrackingEventManager {
  protected readonly client: Client
  private eventQueue: QueuedEvent[] = []
  private readonly throttledManager: ThrottledEventManager
  private readonly batchSize: number

  constructor(
    configuration: Configuration,
    options?: {
      debounceMs?: number
      throttleMs?: number
      batchSize?: number
    },
  ) {
    this.client = new Client(configuration)
    this.throttledManager = new ThrottledEventManager(
      options?.debounceMs ?? 300,
      options?.throttleMs ?? 1000,
    )
    this.batchSize = options?.batchSize ?? 10
    this.throttledManager.setFlushCallback(() => this.flush())
  }

  /**
   * Push a tracking event to the Gally API.
   * Events are queued and batched for efficient processing.
   */
  async pushEvent(input: TrackingEventInput): Promise<TrackingEventResponse> {
    TrackingEventValidator.validate(input)

    return new Promise((resolve, reject) => {
      this.eventQueue.push({ input, resolve, reject })
      this.scheduleFlush()
    })
  }

  /**
   * Schedule a flush of queued events.
   * Uses debouncing and throttling to optimize API calls.
   */
  private scheduleFlush(): void {
    this.throttledManager.schedule()
  }

  /**
   * Flush queued events by sending them in batches.
   */
  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) {
      return
    }

    // Process events in batches
    while (this.eventQueue.length > 0) {
      const batch = this.eventQueue.splice(0, this.batchSize)
      await this.processBatch(batch)
    }
  }

  /**
   * Build a batched GraphQL mutation for multiple tracking events.
   *
   * Generates one aliased mutation call per input, and maps each
   * input to a uniquely named GraphQL variable ($input0, $input1, …).
   *
   * Example output for 2 inputs:
   *
   *   mutation createTrackingEvents($input0: createTrackingEventInput!, $input1: createTrackingEventInput!) {
   *     event0: createTrackingEvent(input: $input0) { trackingEvent { id } }
   *     event1: createTrackingEvent(input: $input1) { trackingEvent { id } }
   *   }
   */
  private buildBatchMutation(batch: QueuedEvent[]): {
    query: string
    variables: Record<string, TrackingEventInput>
  } {
    const variableDefinitions = batch
      .map((_, i) => `$input${i}: createTrackingEventInput!`)
      .join(', ')

    const mutationFields = batch
      .map(
        (_, i) =>
          `event${i}: createTrackingEvent(input: $input${i}) { trackingEvent { id } }`,
      )
      .join('\n        ')

    const query = `
      mutation createTrackingEvents(${variableDefinitions}) {
        ${mutationFields}
      }
    `

    const variables = Object.fromEntries(
      batch.map((item, i) => [`input${i}`, item.input]),
    )

    return { query, variables }
  }

  /**
   * Process a batch of events with a single GraphQL request.
   */
  private async processBatch(batch: QueuedEvent[]): Promise<void> {
    try {
      const { query, variables } = this.buildBatchMutation(batch)
      const response = await this.client.graphql(query, variables, {}, false)

      // Map responses back to promises
      batch.forEach((item, index) => {
        const trackingEvent = response.data?.[`event${index}`]?.trackingEvent

        if (trackingEvent) {
          item.resolve(trackingEvent as TrackingEventResponse)
        } else {
          item.reject(
            new Error('Failed to create tracking event: no data returned'),
          )
        }
      })
    } catch (error) {
      // Reject all items in the batch on error
      batch.forEach((item) => {
        item.reject(error)
      })
    }
  }

  /**
   * Flush any pending events immediately.
   * Useful for cleanup before page unload.
   */
  async flushPending(): Promise<void> {
    await this.flush()
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
    return this.pushEvent({
      ...params,
      eventType: TrackingEventType.ADD_TO_CART,
    })
  }

  async pushOrderEvent(
    params: Omit<TrackingEventInput, 'eventType'>,
  ): Promise<TrackingEventResponse> {
    return this.pushEvent({ ...params, eventType: TrackingEventType.ORDER })
  }
}

export { TrackingEventType, TrackingEventManager, ThrottledEventManager }
export type { TrackingEventInput, TrackingEventResponse }
