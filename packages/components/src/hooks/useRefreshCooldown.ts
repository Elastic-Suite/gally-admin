import { useCallback, useEffect, useState } from 'react'

// Minimum time between two clicks on a button that loads data again, so the
// API is not called over and over.
const defaultRefreshDelay = 1000

/**
 * Returns whether the cooldown is running, and the function that starts it.
 * Call that function on each click that loads the data again.
 */
export function useRefreshCooldown(
  delay = defaultRefreshDelay
): [boolean, () => void] {
  const [isCoolingDown, setIsCoolingDown] = useState(false)

  useEffect(() => {
    if (!isCoolingDown) {
      return undefined
    }
    const timer = setTimeout(() => setIsCoolingDown(false), delay)
    return () => clearTimeout(timer)
  }, [isCoolingDown, delay])

  const startCooldown = useCallback(() => setIsCoolingDown(true), [])

  return [isCoolingDown, startCooldown]
}
