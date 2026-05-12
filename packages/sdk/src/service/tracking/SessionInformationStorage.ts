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
interface SessionInformation {
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
  abstract getSessionInformation(): SessionInformation

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
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  )
}

/**
 * Default implementation using browser cookies for session storage.
 * - uid is stored as a session cookie (expires when browser closes)
 * - vid is stored as a long-term cookie (persists across sessions)
 */
class SessionInformationCookieStorage extends SessionInformationStorage {
  private readonly uidCookieName: string
  private readonly uidMaxAge: number // in seconds (short-term cookie)
  private readonly vidCookieName: string
  private readonly vidMaxAge: number // in seconds (long-term cookie)

  constructor(
    uidCookieName: string = SESSION_UID_COOKIE_NAME,
    vidCookieName: string = SESSION_VID_COOKIE_NAME,
    uidMaxAge: number = 60 * 60, // 1 hour default for uid
    vidMaxAge: number = 365 * 24 * 60 * 60, // 1 year default for vid
  ) {
    super()
    this.uidCookieName = uidCookieName
    this.uidMaxAge = uidMaxAge
    this.vidCookieName = vidCookieName
    this.vidMaxAge = vidMaxAge
  }

  /**
   * Get or create session information from cookies.
   */
  getSessionInformation(): SessionInformation {
    const sessionUid = this.getCookie(this.uidCookieName)
    const sessionVid = this.getCookie(this.vidCookieName)

    // If uid is missing, regenerate it (session cookie may have expired)
    // If vid is missing, regenerate both
    if (!sessionUid) {
      if (!sessionVid) {
        return this.createAndStoreInformation()
      }
      return this.createAndStoreUid(sessionVid)
    }

    // If only vid is missing, regenerate it
    if (!sessionVid) {
      return this.createAndStoreVid(sessionUid)
    }

    return { sessionUid, sessionVid }
  }

  /**
   * Clear session information from cookies.
   */
  clearSessionInformation(): void {
    this.deleteCookie(this.uidCookieName)
    this.deleteCookie(this.vidCookieName)
  }

  /**
   * Create new session information and store it in cookies.
   * uid is a session cookie, vid is a long-term cookie.
   */
  private createAndStoreInformation(): SessionInformation {
    const information: SessionInformation = {
      sessionUid: generateUUID(),
      sessionVid: generateUUID(),
    }

    this.setSessionCookie(this.uidCookieName, information.sessionUid)
    this.setLongTermCookie(this.vidCookieName, information.sessionVid)

    return information
  }

  /**
   * Create and store only a new session UID (session cookie).
   */
  private createAndStoreUid(sessionVid: string): SessionInformation {
    const sessionUid = generateUUID()
    this.setSessionCookie(this.uidCookieName, sessionUid)
    return { sessionUid, sessionVid }
  }

  /**
   * Create and store only a new session VID (long-term cookie).
   */
  private createAndStoreVid(sessionUid: string): SessionInformation {
    const sessionVid = generateUUID()
    this.setLongTermCookie(this.vidCookieName, sessionVid)
    return { sessionUid, sessionVid }
  }

  /**
   * Set a session cookie (expires when browser closes).
   */
  private setSessionCookie(
    name: string,
    value: string,
    maxAge: number = this.uidMaxAge,
  ): void {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/`
  }

  /**
   * Set a long-term cookie with the specified max age.
   */
  private setLongTermCookie(
    name: string,
    value: string,
    maxAge: number = this.vidMaxAge,
  ): void {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/`
  }

  /**
   * Get a cookie value by name.
   */
  private getCookie(name: string): string | null {
    const nameEQ = `${encodeURIComponent(name)}=`
    const cookies = document.cookie.split(';')

    for (const cookie of cookies) {
      const trimmedCookie = cookie.trim()
      if (trimmedCookie.startsWith(nameEQ)) {
        return decodeURIComponent(trimmedCookie.substring(nameEQ.length))
      }
    }

    return null
  }

  /**
   * Delete a cookie by name.
   */
  private deleteCookie(name: string): void {
    document.cookie = `${encodeURIComponent(name)}=; max-age=-1; path=/`
  }
}

export { SessionInformationStorage, SessionInformationCookieStorage }
export type { SessionInformation }
