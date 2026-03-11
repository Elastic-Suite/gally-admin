import { selectBundles, useAppSelector } from '../store'
import { useMemo } from 'react'
import {
  isSearchUsageEnabled,
  premiumHomePageUrl,
  standardHomePageUrl,
} from '@elastic-suite/gally-admin-shared'

export function useHomePageUrl(): string {
  const bundles = useAppSelector(selectBundles)

  return useMemo(() => {
    return isSearchUsageEnabled(bundles)
      ? premiumHomePageUrl
      : standardHomePageUrl
  }, [bundles])
}
