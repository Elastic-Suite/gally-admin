import { useCallback } from 'react'
import Router, { useRouter } from 'next/router'

import { IRouterTab, getRouterPath } from '@elastic-suite/gally-admin-shared'
import { useTabVisibility } from '../contexts/TabVisibilityContext'

export enum TabUrlMatching {
  EXACT = 0,
  PARTIAL = 1,
}

export function useTabs(
  tabs: IRouterTab[],
  matchingMethod: TabUrlMatching = TabUrlMatching.EXACT
): [IRouterTab, (id: number) => void] {
  const { asPath } = useRouter()
  const pathname = getRouterPath(asPath)
  const isVisible = useTabVisibility()

  const activeTab =
    tabs.find((tab) => {
      if (matchingMethod === TabUrlMatching.EXACT) {
        return tab.url === pathname
      }
      // Partial matching: ensure it's followed by a slash or is an exact match
      return pathname === tab.url || pathname.startsWith(`${tab.url}/`)
    }) ?? tabs.find((tab) => tab.default)

  const handleTabChange = useCallback(
    (id: number): void => {
      const tab = tabs.find((tab) => tab.id === id)
      if (tab && isVisible) {
        Router.push(tab.url, undefined, { shallow: true })
      }
    },
    [tabs, isVisible]
  )

  return [activeTab, handleTabChange]
}
