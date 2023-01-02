import { createContext } from 'react'
import { Callback, TFunction } from 'i18next'

interface II18nContext {
  changeLanguage: (language?: string, callback?: Callback) => Promise<TFunction>
}

export const i18nContext = createContext<II18nContext>(null)
