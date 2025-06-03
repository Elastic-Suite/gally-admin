import { styled } from '@mui/material'

export const Title = styled('h3')(({ theme }) => ({
  fontSize: theme.spacing(2.5),
  fontWeight: 600,
  color: theme.palette.colors.neutral[900],
  whiteSpace: 'normal',
  fontFamily: 'var(--gally-font)',
}))
