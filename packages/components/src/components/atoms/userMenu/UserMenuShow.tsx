import React from 'react'
import { styled } from '@mui/system'
import {
  IUser,
  storageRemove,
  tokenStorageKey,
} from '@elastic-suite/gally-admin-shared'

import { setUser, useAppDispatch } from '../../../store'
import FormatText from '../formatText/FormatText'

import { useTranslation } from 'next-i18next'

const CustomTypoTexte = styled('div')(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '18px',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--gally-font)',
  gap: theme.spacing(1),
}))

const CustomTypoEmail = styled('div')(({ theme }) => ({
  fontWeight: '400',
  color: theme.palette.colors.neutral['600'],
}))

const CustomTypoBasic = styled('div')(({ theme }) => ({
  fontWeight: '400',
  color: theme.palette.colors.neutral['800'],
  cursor: 'pointer',
}))

const CustomHr = styled('div')(({ theme }) => ({
  width: '100%',
  border: '1px solid',
  margin: 0,
  borderColor: theme.palette.colors.neutral['300'],
}))

interface IProps {
  user: IUser
}

function UserMenuShow({ user }: IProps): JSX.Element {
  const dispatch = useAppDispatch()

  const { t } = useTranslation('common')

  function handleLogOut(): void {
    storageRemove(tokenStorageKey)
    dispatch(setUser({ token: '', user: null }))
  }

  return (
    <CustomTypoTexte>
      <CustomTypoEmail>
        <FormatText name={user.username} toolTip firstLetterUpp />
      </CustomTypoEmail>
      <CustomHr />
      <CustomTypoBasic onClick={handleLogOut}>{t('log.out')}</CustomTypoBasic>
    </CustomTypoTexte>
  )
}

export default UserMenuShow
