import { IMetadata } from '@elastic-suite/gally-admin-shared'
import { createContext } from 'react'

export const metadataContext = createContext<IMetadata[]>([])
