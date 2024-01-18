import { ReactNode } from 'react'
import { styled } from '@mui/system'

interface IProps {
  children: ReactNode
  error?: boolean
  fullWidth?: boolean
  margin?: 'none' | 'dense' | 'normal'
}

export default styled('div')<IProps>(({ fullWidth, margin, theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  position: 'relative',
  minWidth: 0,
  padding: 0,
  margin: 0,
  border: 0,
  verticalAlign: 'top',
  '& .MuiFormLabel-root': {
    color: theme.palette.colors.neutral[900],
    fontFamily: 'var(--gally-font)',
    padding: 0,
    display: 'block',
    transformOrigin: 'top left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '133%',
    position: 'relative',
    left: 0,
    top: 0,
    transform: 'none',
    fontWeight: 500,
    lineHeight: '20px',
    fontSize: '14px',
  },
  '& .MuiFormLabel-root.Mui-error': {
    color: theme.palette.colors.neutral[900],
  },
  ...(margin === 'normal' && {
    marginTop: 16,
    marginBottom: 8,
  }),
  ...(margin === 'dense' && {
    marginTop: 8,
    marginBottom: 4,
  }),
  ...(fullWidth && {
    width: '100%',
  }),
  ...(fullWidth && {
    '.MuiInputBase-root': {
      width: '100%',
      maxWidth: 'initial',
    },
  }),
}))
