import React, { PropsWithChildren } from 'react'
import { Box } from '@mui/material'
import { IPropsPopIn } from '@elastic-suite/gally-admin-shared'
import { usePopIn } from '../../../hooks/usePopin'
import CustomDialog from './CustomDialog'

function PopIn({
  triggerElement,
  boxStyle,
  onConfirm,
  ...dialogProps
}: PropsWithChildren<IPropsPopIn>): JSX.Element {
  const [open, handleClickOpen, handleClose, handleConfirm] =
    usePopIn(onConfirm)

  return (
    <>
      <Box onClick={handleClickOpen} sx={boxStyle}>
        {triggerElement}
      </Box>
      <CustomDialog
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        open={open}
        {...dialogProps}
      />
    </>
  )
}

export default PopIn
