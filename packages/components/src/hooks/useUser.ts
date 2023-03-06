import {
  IUser,
  getUser,
  storageGet,
  tokenStorageKey,
} from '@elastic-suite/gally-admin-shared'
import { useMemo } from 'react'

export function useUser(): IUser | null {
  const token = storageGet(tokenStorageKey)
  try {
    return useMemo(() => getUser(token), [token])
  } catch (error) {
    return null
  }
}
