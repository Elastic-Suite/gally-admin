import React, { ForwardedRef, ReactNode, forwardRef } from 'react'
import { IconButton, Alert as MuiAlert } from '@mui/material'
import { styled } from '@mui/system'
import { CustomContentProps, SnackbarKey } from 'notistack'
import { useTranslation } from 'next-i18next'

import IonIcon from '../IonIcon/IonIcon'
import { TestId, generateTestId } from '../../../utils/testIds'

const StyledAlert = styled(MuiAlert)(({ severity, theme }) => ({
  padding: `6px ${theme.spacing(2)}`,
  background: theme.palette.colors.neutral[200],
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  color: theme.palette.colors.neutral[600],
  borderRadius: 8,
  alignItems: 'center',
  ...(severity === 'success' && {
    background: theme.palette.success.light,
    color: theme.palette.success.main,
  }),
  ...(severity === 'warning' && {
    background: theme.palette.warning.light,
    color: theme.palette.warning.main,
  }),
  ...(severity === 'error' && {
    background: theme.palette.error.light,
    color: theme.palette.error.main,
  }),
  '& .MuiAlert-icon': {
    color: 'inherit',
    marginRight: theme.spacing(1),
  },
  '& .MuiAlert-message': {
    padding: 0,
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '18px',
    whiteSpace: 'pre-line',
  },
  '& .MuiAlert-action': {
    paddingLeft: '10px',
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },
}))

interface IProps extends Partial<CustomContentProps> {
  onShut?: (id: SnackbarKey) => void
  mb?: number
  children?: ReactNode
}

function Alert(props: IProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element {
  const { id, message, onShut, variant = 'info', mb = 2, children } = props
  const { t } = useTranslation('alert')

  function handleClick(): void {
    onShut?.(id)
  }

  const content = children || t(message as string)

  return (
    <StyledAlert
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={handleClick}
        >
          <IonIcon name="close" style={{ fontSize: 18, padding: '0px' }} />
        </IconButton>
      }
      ref={ref}
      severity={variant as 'success' | 'info' | 'warning' | 'error'}
      sx={{ mb }}
      data-testid={generateTestId(TestId.ALERT, variant)}
    >
      {content}
    </StyledAlert>
  )
}

export default forwardRef(Alert)
