import { selectBundles, useAppSelector } from '../store'
import { useMemo } from 'react'
import {
  isDashboardEnabled,
  premiumHomePageUrl,
  standardHomePageUrl,
} from '@elastic-suite/gally-admin-shared'

export function useHomePageUrl(): string {
  const bundles = useAppSelector(selectBundles)

  return useMemo(() => {
    return isDashboardEnabled(bundles)
      ? premiumHomePageUrl
      : standardHomePageUrl
  }, [bundles])
}
