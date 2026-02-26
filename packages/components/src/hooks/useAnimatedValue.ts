import { useEffect, useRef, useState } from 'react'

interface IUseAnimatedValueOptions {
  duration?: number
  enabled?: boolean
}

export function useAnimatedValue(
  targetValue: number,
  options: IUseAnimatedValueOptions = {}
): number {
  const { duration = 200, enabled = true } = options
  const [displayValue, setDisplayValue] = useState(0)

  // Store the animation frame id for cleanup
  const frameRef = useRef<number>()
  // Store the value at start of animation, so animation begins from the latest displayValue
  const startValueRef = useRef<number>(displayValue)

  useEffect(() => {
    // Cancel any ongoing animation
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }

    if (!enabled) {
      setDisplayValue(targetValue)
      return
    }
    // Capture the current value for each animation start
    startValueRef.current = displayValue

    const startTime = Date.now()
    const animate = (): void => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - (-2 * progress + 2) ** 3 / 2

      const newValue = Math.floor(
        startValueRef.current +
          (targetValue - startValueRef.current) * easeProgress
      )
      setDisplayValue(newValue)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(targetValue)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
    // We intentionally omit displayValue from dependencies:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValue, duration, enabled])

  return displayValue
}
