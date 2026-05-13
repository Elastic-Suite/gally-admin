import { TrackingEventInput } from '../TrackingEventManager'
import { DEFAULT_STORAGE_KEY, EventQueueStorage } from './EventQueueStorage'

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

export { EventQueueLocalStorage }
