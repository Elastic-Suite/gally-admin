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

/**
 * Manages debouncing and throttling for event flushing.
 */
class ThrottledEventManager {
  private debounceTimer: number | null = null
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
      this.debounceTimer = +setTimeout(() => {
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

export { ThrottledEventManager }
