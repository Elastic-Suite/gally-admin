import { Dialog, styled } from '@mui/material'

import {
  IPropsCustomDialog,
  getCustomScrollBarStyles,
} from '@elastic-suite/gally-admin-shared'

const dialogProps = ['position', 'styles']
export const CustomDialogStyled = styled(Dialog, {
  shouldForwardProp: (prop: string) => !dialogProps.includes(prop),
})<IPropsCustomDialog>(({ position, theme, styles }) => {
  return {
    '& *': {
      fontFamily: 'var(--gally-font)',
    },
    '& .MuiDialogActions-root,  & .MuiDialogTitle-root': {
      padding: theme.spacing(4),
    },
    '& .MuiDialog-container': {
      justifyContent:
        position === 'left'
          ? 'flex-start'
          : position === 'right'
          ? 'flex-end'
          : 'center',
    },
    '& .MuiDialogTitle-root': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #E2E6F3',
      color: '#151A47',
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '20px',
      ...styles?.title,
    },
    '& .MuiDialog-paper': {
      minWidth: '200px',
      padding: theme.spacing(0),
      margin: theme.spacing(0),
      ...styles?.paper,
    },
    '& .MuiDialogContent-root': {
      display: 'flex',
      flexDirection: 'Column',
      ...styles?.content,
      ...getCustomScrollBarStyles(theme),
      margin: `${theme.spacing(4)} ${theme.spacing(0.5)}`,
      padding: `${theme.spacing(0)} ${theme.spacing(3.5)}`,
    },
    '& .MuiDialogActions-root': {
      ...styles?.actions,
    },
  }
})

export const CustomClose = styled('div')(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  top: theme.spacing(1),
  right: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 500ms',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  color: theme.palette.colors.neutral['900'],
  '&:hover': {
    background: theme.palette.colors.neutral['200'],
  },
}))

export const CustomTitle = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(7),
  textAlign: 'center',
  fontWeight: '400',
  color: theme.palette.colors.neutral[900],
  fontSize: '18px',
  fontFamily: 'var(--gally-font)',
  lineHeight: '28px',
  marginBottom: theme.spacing(7),
}))
