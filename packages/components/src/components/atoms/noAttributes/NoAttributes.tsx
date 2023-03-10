import React from 'react'
import { styled } from '@mui/system'
import Link from 'next/link'

import Button from '../buttons/Button'
import IonIcon from '../IonIcon/IonIcon'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  padding: theme.spacing(8),
  border: '1px solid',
  borderColor: theme.palette.colors.neutral['300'],
  borderRadius: theme.spacing(1),
  background: theme.palette.colors.white,
  textAlign: 'center',
  alignItems: 'center',
}))

const CustomTitle = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral['600'],
  fontSize: '18px',
  lineHeight: '28px',
  fontWeight: '600',
  fontFamily: 'var(--gally-font)',
  width: '550px',
}))

interface IProps {
  title: string
  btnTitle?: string
  btnHref?: string
}

function NoAttributes({ title, btnTitle, btnHref }: IProps): JSX.Element {
  return (
    <CustomRoot>
      <IonIcon
        name="telescope"
        style={{ color: '#8187B9', width: '40px', height: '40px' }}
      />
      <CustomTitle>{title}</CustomTitle>
      {Boolean(btnTitle) && (
        <Button endIcon={null} startIcon={null} size="large">
          <Link href={`/${btnHref}`} legacyBehavior passHref>
            <a style={{ textDecoration: 'none' }}>{btnTitle}</a>
          </Link>
        </Button>
      )}
    </CustomRoot>
  )
}

export default NoAttributes
