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

/**
 * Default implementation using browser localStorage for queue persistence.
 * Events survive page reloads and can be replayed on the next session.
 */
class EventQueueLocalStorage extends EventQueueStorage {
  private readonly storageKey: string

  constructor(storageKey: string = DEFAULT_STORAGE_KEY) {
    super()
    this.storageKey = storageKey
  }

  /**
   * Append a single event to the persistent queue.
   */
  enqueue(input: TrackingEventInput): void {
    const current = this.readAll()
    current.push(input)
    this.writeAll(current)
  }

  /**
   * Retrieve and remove all pending events from storage.
   */
  dequeueAll(): TrackingEventInput[] {
    const events = this.readAll()
    this.clear()
    return events
  }

  /**
   * Remove all events from storage.
   */
  clear(): void {
    localStorage.removeItem(this.storageKey)
  }

  /**
   * Return the number of events currently in storage.
   */
  size(): number {
    return this.readAll().length
  }

  /**
   * Read all events from localStorage, returning an empty array on failure.
   */
  private readAll(): TrackingEventInput[] {
    try {
      const raw = localStorage.getItem(this.storageKey)
      if (!raw) {
        return []
      }
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        return []
      }
      return parsed as TrackingEventInput[]
    } catch {
      return []
    }
  }

  /**
   * Write all events to localStorage.
   */
  private writeAll(events: TrackingEventInput[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(events))
    } catch {
      // Silently ignore storage quota errors
    }
  }
}

export { EventQueueStorage, EventQueueLocalStorage }
export { DEFAULT_STORAGE_KEY }
