import React, { useContext } from 'react'
import { TFunction, useTranslation } from 'next-i18next'
import { i18nContext } from '../../../contexts'
import { styled } from '@mui/system'

const CustomRoot = styled('div')(({ theme }) => ({
  fontSize: theme.spacing(3.5),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  ':hover': {
    opacity: 0.7,
  },
}))

function Language(): JSX.Element {
  const translation = useTranslation()
  const { i18n } = translation
  const { changeLanguage } = useContext(i18nContext)
  switch (i18n.language) {
    case 'fr':
      return (
        <CustomRoot onClick={(): Promise<TFunction> => changeLanguage('en')}>
          🇬🇧
        </CustomRoot>
      )

    default:
      return (
        <CustomRoot onClick={(): Promise<TFunction> => changeLanguage('fr')}>
          🇫🇷
        </CustomRoot>
      )
  }
}

export default Language
