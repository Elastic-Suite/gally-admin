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
 * Session information containing unique identifiers for session tracking.
 */
interface ISessionInformation {
  sessionUid: string
  sessionVid: string
}

/**
 * Abstract class for managing session information storage.
 * Allows users to implement custom session storage mechanisms.
 */
abstract class SessionInformationStorage {
  /**
   * Get or create session information (uid and vid).
   * Should generate new session IDs if they don't exist.
   */
  abstract getSessionInformation(): ISessionInformation

  /**
   * Clear session information.
   */
  abstract clearSessionInformation(): void
}

export const SESSION_UID_COOKIE_NAME = 'gally-uid'
export const SESSION_VID_COOKIE_NAME = 'gally-vid'

/**
 * Utility function to generate a UUID v4-like identifier.
 */
function generateUUID(): string {
  function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

export { generateUUID, SessionInformationStorage }
export type { ISessionInformation }
