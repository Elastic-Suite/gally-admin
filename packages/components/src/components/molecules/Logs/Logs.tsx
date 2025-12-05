import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { ILog } from '@elastic-suite/gally-admin-shared'
import Button from '../../atoms/buttons/Button'
import LogsList from './LogsList'
import { useTranslation } from 'next-i18next'

interface IProps {
  logs: ILog[]
}

function Logs(props: IProps): JSX.Element {
  const { logs } = props

  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

  return (
    <>
      <Button
        disabled={!logs.length}
        display="secondary"
        size="small"
        startIcon={<VisibilityIcon />}
        onClick={handleOpen}
        title={logs.length ? t('logs.view') : t('logs.noLogs')}
      >
        {t('logs.view')}
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
            {t('logs')}
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
