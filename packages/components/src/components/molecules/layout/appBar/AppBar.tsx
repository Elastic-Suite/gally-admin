import React from 'react'
import { styled } from '@mui/system'
import { IMenu } from '@elastic-suite/gally-admin-shared'

import Breadcrumbs from '../../../atoms/breadcrumb/Breadcrumbs'

import User from '../../layout/user/User'
import { TestId, generateTestId } from '../../../../utils/testIds'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
  paddingRight: theme.spacing(4),
  paddingLeft: theme.spacing(4),
  position: 'fixed',
  right: 0,
  zIndex: '9',
  height: theme.spacing(8),
  backgroundColor: theme.palette.background.page,
  left: 'inherit',
  '&::before': {
    content: '""',
    position: 'absolute',
    border: '1px solid',
    borderColor: theme.palette.colors.neutral['300'],
    bottom: 0,
    width: `calc(100% - 64px)`,
  },
}))

interface IProps {
  slug?: string | string[]
  menu?: IMenu
  isConnected: boolean
}

function AppBar({ slug, menu, isConnected }: IProps): JSX.Element {
  return (
    <CustomRoot data-testid={generateTestId(TestId.APP_BAR)}>
      <Breadcrumbs slug={slug} menu={menu} />
      <User isConnected={isConnected} />
    </CustomRoot>
  )
}

export default AppBar
