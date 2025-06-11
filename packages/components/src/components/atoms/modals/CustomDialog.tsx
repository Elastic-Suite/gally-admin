import React, { PropsWithChildren } from 'react'
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { CustomClose, CustomDialogStyled, CustomTitle } from './PopIn.styled'
import IonIcon from '../IonIcon/IonIcon'
import Button from '../buttons/Button'
import { ICustomDialog } from '@elastic-suite/gally-admin-shared'

function CustomDialog({
  open,
  handleClose,
  handleConfirm,
  confirmationPopIn,
  titlePopIn,
  actions,
  children,
  position,
  styles,
  cancelName,
  confirmName,
  loading,
}: PropsWithChildren<ICustomDialog>): JSX.Element {
  return (
    <CustomDialogStyled
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
          {actions ? <DialogActions> {actions} </DialogActions> : null}
        </>
      ) : (
        <>
          <CustomTitle> {titlePopIn} </CustomTitle>
          <DialogActions>
            <Box>
              <Button
                data-testid="cancelButton"
                onClick={handleClose}
                display="tertiary"
                size="large"
              >
                {cancelName}
              </Button>
            </Box>
            <Box>
              <Button
                data-testid="confirmButton"
                onClick={handleConfirm}
                loading={loading}
                size="large"
              >
                {confirmName}
              </Button>
            </Box>
          </DialogActions>
        </>
      )}
    </CustomDialogStyled>
  )
}

export default CustomDialog
