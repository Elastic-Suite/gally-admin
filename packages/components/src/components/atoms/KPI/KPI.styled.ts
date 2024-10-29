import { CSSProperties } from 'react'
import { styled } from '@mui/system'

export const comonStyle: CSSProperties = {
  textAlign: 'center',
  margin: 0,
  fontFamily: 'var(--gally-font)',
}

export const Title = styled('h3')(({ theme }) => ({
  ...comonStyle,
  fontSize: theme.spacing(2),
  fontWeight: 400,
  color: theme.palette.colors.neutral[600],
  textTransform: 'capitalize',
  whiteSpace: 'normal',
}))

export const Content = styled('p')(({ theme }) => ({
  ...comonStyle,
  fontSize: theme.spacing(6),
  fontWeight: 700,
  color: theme.palette.colors.primary.main,
  letterSpacing: '-0.4px',
}))

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  width: 232,
}))
