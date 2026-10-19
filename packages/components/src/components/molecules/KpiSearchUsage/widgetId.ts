import { createContext, useContext } from 'react'

import { joinItemIds } from '../../../utils/testIds'

// Layout path of the current widget, e.g. "charts|sessions". Keeps test ids
// unique when the same widget appears twice.
export const indicatorInstanceContext = createContext('')

export function useWidgetId(kind: string): string {
  const instance = useContext(indicatorInstanceContext)
  return joinItemIds(kind, instance)
}
