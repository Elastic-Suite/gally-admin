import React, { useEffect, useMemo } from 'react'
import { TFunction, useTranslation } from 'next-i18next'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Callback } from 'i18next'

import { i18nContext } from '../../../contexts'
import { setLanguage, useAppDispatch } from '../../../store'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Locale } from 'date-fns'

interface ILocale {
  load: () => Promise<{ default: Locale }>
  locale?: Locale
}

enum ILocaleAvailable {
  FR = 'fr',
  EN_US = 'en',
}

const languages: Record<ILocaleAvailable, ILocale> = {
  fr: {
    load: () => import('date-fns/locale/fr'),
  },
  en: {
    load: () => import('date-fns/locale/en-US'),
  },
}
interface IProps {
  children: JSX.Element
}

function I18nProvider(props: IProps): JSX.Element {
  const { children } = props
  const translation = useTranslation()
  const dispatch = useAppDispatch()
  const { i18n } = translation

  useEffect(() => {
    if (i18n.language && i18n.language !== 'en') {
      context.changeLanguage(i18n.language)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  useEffect(() => {
    if (i18n.language) {
      dispatch(setLanguage(i18n.language))
    }
  }, [dispatch, i18n.language])

  const context = useMemo(
    () => ({
      changeLanguage: async (
        language: string,
        callback?: Callback
      ): Promise<TFunction> => {
        const locale = await languages[language as ILocaleAvailable].load()
        if (languages[language as ILocaleAvailable] && locale.default) {
          languages[language as ILocaleAvailable].locale = locale.default
          return translation.i18n.changeLanguage(language, callback)
        }
        return null
      },
    }),
    [translation.i18n]
  )

  return (
    <LocalizationProvider
      adapterLocale={languages[i18n.language as ILocaleAvailable]?.locale}
      dateAdapter={AdapterDateFns}
    >
      <i18nContext.Provider value={context}>{children}</i18nContext.Provider>
    </LocalizationProvider>
  )
}

export default I18nProvider
