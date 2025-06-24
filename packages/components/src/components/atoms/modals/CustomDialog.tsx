import React, { PropsWithChildren } from 'react'
import { Box, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { CustomClose, CustomDialogStyled, CustomTitle } from './PopIn.styled'
import IonIcon from '../IonIcon/IonIcon'
import Button from '../buttons/Button'
import { ICustomDialog } from '@elastic-suite/gally-admin-shared'
import { TestId, generateTestId } from '../../../utils/testIds'

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
  componentId,
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
      data-testid={generateTestId(TestId.DIALOG)}
    >
      <CustomClose
        onClick={handleClose}
        data-testid={generateTestId(TestId.DIALOG_CLOSE_BUTTON, componentId)}
      >
        <IonIcon name="close" style={{ fontSize: '17.85px' }} />
      </CustomClose>
      {!confirmationPopIn ? (
        <>
          {titlePopIn ? <DialogTitle> {titlePopIn} </DialogTitle> : null}
          <DialogContent
            data-testid={generateTestId(TestId.DIALOG_CONTENT, componentId)}
          >
            {children}
          </DialogContent>
          {actions ? <DialogActions> {actions} </DialogActions> : null}
        </>
      ) : (
        <>
          <CustomTitle> {titlePopIn} </CustomTitle>
          <DialogActions>
            <Box>
              <Button
                data-testid={generateTestId(
                  TestId.DIALOG_CANCEL_BUTTON,
                  componentId
                )}
                onClick={handleClose}
                display="tertiary"
                size="large"
              >
                {cancelName}
              </Button>
            </Box>
            <Box>
              <Button
                data-testid={generateTestId(
                  TestId.DIALOG_CONFIRM_BUTTON,
                  componentId
                )}
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
