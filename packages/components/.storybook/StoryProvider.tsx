import { useContext, useEffect } from 'react'

import { i18nContext } from '../src/contexts'

interface IProps {
  children: JSX.Element
  locale: string
}

function StorybookProvider(props: IProps): JSX.Element {
  const { children, locale } = props
  const { changeLanguage } = useContext(i18nContext)

  useEffect(() => {
    changeLanguage(locale)
  }, [changeLanguage, locale])

  return children
}

export default StorybookProvider
