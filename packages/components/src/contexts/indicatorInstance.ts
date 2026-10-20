import { createContext } from 'react'

// Layout path of the current widget, e.g. "charts|sessions". Keeps test ids
// unique when the same widget appears twice.
export const indicatorInstanceContext = createContext('')
