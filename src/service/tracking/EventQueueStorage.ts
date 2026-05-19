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

import { TrackingEventInput } from '../TrackingEventManager'

const DEFAULT_STORAGE_KEY = 'gally-event-queue'

/**
 * Abstract class for managing event queue persistence.
 * Allows users to implement custom queue storage mechanisms.
 */
abstract class EventQueueStorage {
  /**
   * Append a single event to the persistent queue.
   */
  abstract enqueue(input: TrackingEventInput): void

  /**
   * Retrieve all pending events from storage.
   */
  abstract dequeueAll(): TrackingEventInput[]

  /**
   * Remove all events from storage.
   */
  abstract clear(): void

  /**
   * Return the number of events currently in storage.
   */
  abstract size(): number
}

export { EventQueueStorage }
export { DEFAULT_STORAGE_KEY }
