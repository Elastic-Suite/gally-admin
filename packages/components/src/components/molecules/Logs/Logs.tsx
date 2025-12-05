import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { ILog } from '@elastic-suite/gally-admin-shared'
import LogsList from './LogsList'

interface IProps {
  logs: ILog[]
}

function Logs(props: IProps): JSX.Element {
  const { logs } = props
  const [open, setOpen] = useState(false)

  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<VisibilityIcon />}
        onClick={handleOpen}
      >
        View Logs
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: '90vw',
            maxWidth: '1400px',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="span">
            Job Logs
          </Typography>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <LogsList logs={logs} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Logs
