import React from 'react'
import { styled } from '@mui/system'
import Link from 'next/link'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingRight: theme.spacing(1.5),
  paddingLeft: theme.spacing(1.5),
  color: theme.palette.colors.neutral['800'],
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '12px',
  fontFamily: 'Invar(--gally-font)ter',
  lineHeight: '18px',
}))

const CustomA = styled('a')({
  textDecoration: 'none',
})

function HelpOver(): JSX.Element {
  return (
    <CustomRoot data-testid="helpOver">
      <Link href="https://elasticsuite.zendesk.com" legacyBehavior passHref>
        <CustomA>Helpdesk</CustomA>
      </Link>

      <Link
        href="https://elastic-suite.github.io/documentation/"
        legacyBehavior
        passHref
      >
        <CustomA>User guide</CustomA>
      </Link>

      {process.env.NODE_ENV === 'development' && (
        <CustomA href="/docs">API documentation</CustomA>
      )}
    </CustomRoot>
  )
}

export default HelpOver
