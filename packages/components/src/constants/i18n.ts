import HttpBackend from 'i18next-http-backend'
import ChainedBackend from 'i18next-chained-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'
import { UserConfig } from 'next-i18next'

// See https://github.com/i18next/i18next-http-backend/tree/master/example/next
export const nextI18nConfig = {
  backend: {
    backendOptions: [{ expirationTime: 60 * 60 * 1000 }],
    backends:
      typeof window !== 'undefined' ? [LocalStorageBackend, HttpBackend] : [],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
  serializeConfig: false,
  use: typeof window !== 'undefined' ? [ChainedBackend] : [],
} as unknown as UserConfig
