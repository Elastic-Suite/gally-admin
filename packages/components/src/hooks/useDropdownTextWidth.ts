import { useMemo } from 'react'
import { IOptions } from '@elastic-suite/gally-admin-shared'

// Character width constants (in pixels)
const CHAR_WIDTH = {
  WIDE: 9,
  MEDIUM: 6,
  NARROW: 2,
  EXTRA_WIDE: 12,
  DEFAULT: 8,
} as const

// Character type patterns
const CHAR_PATTERNS = {
  WIDE: /[A-Z0-9@#$%&*()_+={}[\]:;"'<>,.?/\\|~`]/,
  MEDIUM: /[bdfhijkltBDFHIJKLT]/,
  NARROW: /[il1!| ]/,
  EXTRA_WIDE: /[mwMW]/,
} as const

/**
 * Hook to calculate the maximum text width from a list of options
 * @param options - Array of options with label property
 * @param padding - Additional padding to add to the calculated width (default: 80)
 * @param defaultMinWidth - Minimum width to return if calculated width is smaller
 * @returns The calculated maximum width in pixels
 */
export function useDropdownTextWidth(
  options: IOptions<unknown>,
  defaultMinWidth: number,
  padding = 80
): number {
  return useMemo(() => {
    if (options.length === 0) {
      return defaultMinWidth
    }

    const calculateTextWidth = (text: string): number => {
      let width = 0
      for (const char of text) {
        // Wide characters (uppercase, numbers, special chars)
        if (CHAR_PATTERNS.WIDE.test(char)) {
          width += CHAR_WIDTH.WIDE
        }
        // Medium characters (lowercase with ascenders/descenders)
        else if (CHAR_PATTERNS.MEDIUM.test(char)) {
          width += CHAR_WIDTH.MEDIUM
        }
        // Narrow characters
        else if (CHAR_PATTERNS.NARROW.test(char)) {
          width += CHAR_WIDTH.NARROW
        }
        // Wide lowercase characters
        else if (CHAR_PATTERNS.EXTRA_WIDE.test(char)) {
          width += CHAR_WIDTH.EXTRA_WIDE
        }
        // Default characters
        else {
          width += CHAR_WIDTH.DEFAULT
        }
      }
      return width
    }

    const maxLabelWidth = Math.max(
      ...options.map((o) => (o.label ? calculateTextWidth(o.label) : 0))
    )

    const calculatedWidth = maxLabelWidth + padding

    return calculatedWidth < defaultMinWidth ? calculatedWidth : defaultMinWidth
  }, [options, padding, defaultMinWidth])
}
