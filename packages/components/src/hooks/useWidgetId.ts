import { useContext } from 'react'

import { indicatorInstanceContext } from '../contexts'
import { joinItemIds } from '../utils/testIds'

export function useWidgetId(kind: string): string {
  const instance = useContext(indicatorInstanceContext)
  return joinItemIds(kind, instance)
}
