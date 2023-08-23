import React, { PropsWithChildren, ReactNode, useState } from 'react'
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import {
  CustomClose,
  CustomDialog,
  CustomTitle,
  IPropsCustomDialog,
} from './PopIn.styled'
import IonIcon from '../IonIcon/IonIcon'
import Button from '../buttons/Button'
import { useLog } from '../../../hooks'

interface IProps extends Omit<IPropsCustomDialog, 'open'> {
  confirmationPopIn?: boolean
  triggerElement: ReactNode
  actions?: ReactNode
  titlePopIn?: string
  onConfirm?: () => void | Promise<void>
  cancelName?: string
  confirmName?: string
  loading?: boolean
}

function PopIn({
  confirmationPopIn,
  triggerElement,
  titlePopIn,
  actions,
  children,
  position,
  styles,
  onConfirm,
  cancelName,
  confirmName,
  loading,
}: PropsWithChildren<IProps>): JSX.Element {
  const [open, setOpen] = useState(false)
  const log = useLog()

  function handleClickOpen(): void {
    setOpen(true)
  }

  function handleClose(): void {
    setOpen(false)
  }

  async function handleConfirm(): Promise<void> {
    if (typeof onConfirm === 'function') {
      try {
        const result = onConfirm()
        if (result instanceof Promise) {
          return await result
        }
      } catch (error) {
        return log(error)
      }
    }
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <Box onClick={handleClickOpen}>{triggerElement}</Box>

      <CustomDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        position={position}
        styles={
          confirmationPopIn
            ? {
                actions: {
                  padding: '0 32px 32px 32px',
                  justifyContent: 'center',
                  gap: 1,
                },
              }
            : styles
        }
      >
        <CustomClose onClick={handleClose}>
          <IonIcon name="close" style={{ fontSize: '17.85px' }} />
        </CustomClose>
        {!confirmationPopIn ? (
          <>
            {titlePopIn ? <DialogTitle> {titlePopIn} </DialogTitle> : null}
            <DialogContent>{children}</DialogContent>
            <DialogActions> {actions} </DialogActions>
          </>
        ) : (
          <>
            <CustomTitle> {titlePopIn} </CustomTitle>
            <DialogActions>
              <Box>
                <Button onClick={handleClose} display="tertiary" size="large">
                  {cancelName}
                </Button>
              </Box>
              <Box>
                <Button onClick={handleConfirm} loading={loading} size="large">
                  {confirmName}
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </CustomDialog>
    </div>
  )
}

export default PopIn
