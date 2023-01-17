import { createContext } from 'react'

import { IRuleOptionsContext } from '@elastic-suite/gally-admin-shared'

export const ruleOptionsContext = createContext<IRuleOptionsContext>(null)
