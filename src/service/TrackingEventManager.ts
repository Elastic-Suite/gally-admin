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
import { TrackingEventType, TrackingEventValidator } from '../validator'
import { ThrottledEventManager } from './tracking/ThrottledEventManager'
import {
  SessionInformationStorage,
  SessionInformationCookieStorage,
  SESSION_UID_COOKIE_NAME,
  SESSION_VID_COOKIE_NAME,
} from './tracking/SessionInformationStorage'
import {
  TrackingEventContextStorage,
  TrackingEventContextSessionStorage,
} from './tracking/TrackingEventContextStorage'
import {
  EventQueueStorage,
  EventQueueLocalStorage,
} from './tracking/EventQueueStorage'

declare global {
  interface Window {
    gallyEvent: TrackingEventManager & {
      init: typeof TrackingEventManager.init
    }
  }
}

/**
 * Module-level reference to the real instance, captured by the Proxy closure.
 * Kept separate from window.gallyEvent so the Proxy can safely reference it.
 */
let instance: TrackingEventManager | null = null

if (typeof window !== 'undefined') {
  window.gallyEvent = new Proxy(
    {} as TrackingEventManager & { init: typeof TrackingEventManager.init },
    {
      get(_target, prop: string | symbol) {
        if (prop === 'init') {
          return TrackingEventManager.init.bind(TrackingEventManager)
        }
        if (instance) {
          return (instance as unknown as Record<string | symbol, unknown>)[prop]
        }
        throw new Error(
          `TrackingEventManager: tracker not initialized — call TrackingEventManager.init() first`,
        )
      },
    },
  )
}

/**
 * Common tracking event properties shared between API response fields.
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
 * sessionUid and sessionVid are optional here as they can be
 * automatically populated from session storage.
 */
type TrackingEventInput = Omit<
  TrackingEventBase,
  'sessionUid' | 'sessionVid'
> & {
  sessionUid?: string
  sessionVid?: string
}

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

interface TrackingEventManagerOptions {
  baseUri: string
  debounceMs?: number
  throttleMs?: number
  batchSize?: number
  uidCookieMaxAge?: number
  vidCookieMaxAge?: number
  trackingEventContextStorage?: TrackingEventContextStorage
  sessionInformationStorage?: SessionInformationStorage
  eventQueueStorage?: EventQueueStorage
}

/**

  * Tracking event manager service. *
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
  private trackingEventContextStorage: TrackingEventContextStorage
  private sessionInformationStorage: SessionInformationStorage
  private readonly eventQueueStorage: EventQueueStorage

  static init(options: TrackingEventManagerOptions): TrackingEventManager {
    if (instance) {
      return instance
    }
    const { baseUri, ...optionsRest } = options
    const config = new Configuration({ baseUri })
    return new TrackingEventManager(config, optionsRest)
  }

  private constructor(
    configuration: Configuration,
    options?: {
      debounceMs?: number
      throttleMs?: number
      batchSize?: number
      uidCookieMaxAge?: number
      vidCookieMaxAge?: number
      trackingEventContextStorage?: TrackingEventContextStorage
      sessionInformationStorage?: SessionInformationStorage
      eventQueueStorage?: EventQueueStorage
    },
  ) {
    this.client = new Client(configuration)
    this.throttledManager = new ThrottledEventManager(
      options?.debounceMs ?? 300,
      options?.throttleMs ?? 1000,
    )
    this.batchSize = options?.batchSize ?? 10
    this.throttledManager.setFlushCallback(() => this.flush())
    this.trackingEventContextStorage =
      options?.trackingEventContextStorage ??
      new TrackingEventContextSessionStorage()
    this.sessionInformationStorage =
      options?.sessionInformationStorage ??
      new SessionInformationCookieStorage(
        SESSION_UID_COOKIE_NAME,
        SESSION_VID_COOKIE_NAME,
        options?.uidCookieMaxAge,
        options?.vidCookieMaxAge,
      )
    this.eventQueueStorage =
      options?.eventQueueStorage ?? new EventQueueLocalStorage()

    this.register()

    // Replay any events that were persisted but not sent before the last page unload
    this.replayPersistedEvents()
  }

  /**
   * Push a tracking event to the Gally API.
   * Events are queued and batched for efficient processing.
   */
  async push(input: TrackingEventInput): Promise<TrackingEventResponse> {
    // Populate session information if not already provided
    const { sessionUid, sessionVid } =
      this.sessionInformationStorage.getSessionInformation()
    if (!input.sessionUid) {
      input.sessionUid = sessionUid
    }
    if (!input.sessionVid) {
      input.sessionVid = sessionVid
    }

    const existingContext =
      this.trackingEventContextStorage.getTrackingContext()
    if (existingContext) {
      // We don't override an existing context,
      // But use the global one if no context was given in input
      input = { ...existingContext, ...input }
    }
    // Validate the event now that we have a complete event
    TrackingEventValidator.validate(input)
    // Update the context if the event should change it
    this.trackingEventContextStorage.checkAndUpdateContext(input)

    // Persist the event so it can be replayed if the page unloads before flush
    this.eventQueueStorage.enqueue(input)

    return new Promise((resolve, reject) => {
      this.eventQueue.push({ input, resolve, reject })
      this.scheduleFlush()
    })
  }

  /**
   * Register this instance as the active tracker.
   */
  private register(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this
  }

  /**
   * Replay events that were persisted in storage but never sent
   * (e.g. due to a page reload before the queue was flushed).
   * These events are fire-and-forget: no promise is returned to the caller.
   */
  private replayPersistedEvents(): void {
    const pending = this.eventQueueStorage.dequeueAll()
    if (pending.length === 0) {
      return
    }

    for (const input of pending) {
      this.push(input)
    }

    this.scheduleFlush()
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

    // All events have been sent — clear the persistent queue
    this.eventQueueStorage.clear()
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
}

export { TrackingEventType, TrackingEventManager }
export type { TrackingEventInput, TrackingEventResponse }
export { ThrottledEventManager } from './tracking/ThrottledEventManager'
export {
  SessionInformationStorage,
  SessionInformationCookieStorage,
} from './tracking/SessionInformationStorage'
export type { SessionInformation } from './tracking/SessionInformationStorage'
export {
  TrackingEventContextStorage,
  TrackingEventContextSessionStorage,
} from './tracking/TrackingEventContextStorage'
export {
  EventQueueStorage,
  EventQueueLocalStorage,
} from './tracking/EventQueueStorage'
