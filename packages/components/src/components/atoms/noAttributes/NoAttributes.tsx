import React from 'react'
import { styled } from '@mui/system'
import Link from 'next/link'

import Button from '../buttons/Button'
import IonIcon from '../IonIcon/IonIcon'
import { useRouter } from 'next/router'

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

export interface INoAttributesProps {
  title: string
  btnTitle?: string
  btnHref?: string
  absolutLink?: boolean
}

function NoAttributes(props: INoAttributesProps): JSX.Element {
  const { title, btnTitle, btnHref, absolutLink = true } = props

  const { pathname } = useRouter()
  const pathnameWithoutLastFile =
    !absolutLink && pathname
      ? pathname.substring(0, pathname.lastIndexOf('/'))
      : ''

  return (
    <CustomRoot>
      <IonIcon
        name="telescope"
        style={{ color: '#8187B9', width: '40px', height: '40px' }}
      />
      <CustomTitle>{title}</CustomTitle>
      {Boolean(btnTitle) && (
        <Button endIcon={null} startIcon={null} size="large">
          <Link
            href={`${pathnameWithoutLastFile}/${btnHref}`}
            legacyBehavior
            passHref
          >
            <a style={{ textDecoration: 'none' }}>{btnTitle}</a>
          </Link>
        </Button>
      )}
    </CustomRoot>
  )
}

export default NoAttributes
