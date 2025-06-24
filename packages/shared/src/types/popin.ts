import React, { ReactNode } from 'react'
import { DialogProps } from '@mui/material'
interface ICustomDialogStyles {
  paper?: React.CSSProperties
  title?: React.CSSProperties
  actions?: React.CSSProperties
  content?: React.CSSProperties
}
export interface IPropsCustomDialog extends DialogProps {
  position: 'left' | 'right' | 'center'
  styles?: ICustomDialogStyles
}
export interface ICustomDialog extends IPropsCustomDialog {
  handleClose: () => void
  handleConfirm?: () => Promise<void>
  confirmationPopIn?: boolean
  actions?: ReactNode
  titlePopIn?: string
  cancelName?: string
  confirmName?: string
  loading?: boolean
  componentId?: string
}

export interface IPropsPopIn
  extends Omit<ICustomDialog, 'open' | 'handleClose'> {
  triggerElement: ReactNode
  onConfirm?: () => void | Promise<void>
  boxStyle?: React.CSSProperties
  componentId?: string
}
