import { useCallback, useEffect, useState } from 'react'

const defaultRefreshDelay = 1000

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
