import { useEffect, useState } from 'react'

interface IUseAnimatedValueOptions {
  duration?: number
  enabled?: boolean
}

export function useAnimatedValue(
  targetValue: number,
  options: IUseAnimatedValueOptions = {}
): number {
  const { duration = 80, enabled = true } = options
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(targetValue)
      return
    }

    const startTime = Date.now()
    const startValue = displayValue

    const animate = (): void => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-in-out cubic
      const easeProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - (-2 * progress + 2) ** 3 / 2

      const newValue = Math.floor(
        startValue + (targetValue - startValue) * easeProgress
      )
      setDisplayValue(newValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(targetValue)
      }
    }

    requestAnimationFrame(animate)
  }, [targetValue, duration, displayValue, enabled])

  return displayValue
}
