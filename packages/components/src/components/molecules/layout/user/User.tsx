import React from 'react'
import { styled } from '@mui/system'

import Help from '../../../atoms/help/Help'
import UserMenu from '../../../atoms/userMenu/UserMenu'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  marginLeft: 'auto',
}))

interface IProps {
  isConnected: boolean
}

function User({ isConnected }: IProps): JSX.Element | null {
  if (!isConnected) {
    return null
  }

  return (
    <CustomRoot>
      <Help />
      <UserMenu />
    </CustomRoot>
  )
}

export default User
