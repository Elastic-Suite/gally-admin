import { useCallback } from 'react'
import Router, { useRouter } from 'next/router'

import { IRouterTab, getRouterPath } from '@elastic-suite/gally-admin-shared'

export function useTabs(
  tabs: IRouterTab[]
): [IRouterTab, (id: number) => void] {
  const { asPath } = useRouter()
  const pathname = getRouterPath(asPath)
  const activeTab =
    tabs.find((tab) => tab.url === pathname) ?? tabs.find((tab) => tab.default)

  const handleTabChange = useCallback(
    (id: number): void => {
      const tab = tabs.find((tab) => tab.id === id)
      if (tab) {
        Router.push(tab.url, undefined, { shallow: true })
      }
    },
    [tabs]
  )

  return [activeTab, handleTabChange]
}
