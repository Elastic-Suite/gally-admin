import React, { useCallback } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'next-i18next'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { IJobProfileInfos, isError } from '@elastic-suite/gally-admin-shared'
import FileUploadDropzone from '../FileUploadDropzone/FileUploadDropzone'
import { useResource, useResourceOperations } from '../../../hooks'
import { TestId, generateTestId } from '../../../utils/testIds'

interface IProps {
  isOpen: boolean
  profile: IJobProfileInfos | null
  onClose: () => void
  onFileUploaded?: () => void
  title?: string
}

function UploadJobFileModal(props: IProps): JSX.Element {
  const { isOpen, profile, onClose, onFileUploaded, title } = props
  const { t } = useTranslation('importExport')
  const acceptedFileTypes = ['csv']

  const jobFileResource = useResource('JobFile')
  const { create: createJobFile } = useResourceOperations(jobFileResource)
  const jobResource = useResource('Job')
  const { create: createJob } = useResourceOperations(jobResource)

  const modalTitle = title ?? profile?.label ?? ''

  const handleFileUpload = useCallback(
    async (file: File): Promise<void> => {
      const formData = new FormData()
      formData.append('file', file)
      const sendingJobFileInfosToApi = await createJobFile(formData)

      if (isError(sendingJobFileInfosToApi)) {
        enqueueSnackbar(t('error.fileUpload'), {
          onShut: closeSnackbar,
          variant: 'error',
        })
        return
      }

      const sendingJobToApi = await createJob({
        type: 'import',
        profile: profile.profile,
        file: sendingJobFileInfosToApi['@id'],
      })

      if (isError(sendingJobToApi)) {
        enqueueSnackbar(t('error.createImportJob'), {
          onShut: closeSnackbar,
          variant: 'error',
        })
        return
      }

      enqueueSnackbar(t('success.importJobCreated'), {
        onShut: closeSnackbar,
        variant: 'success',
      })

      onFileUploaded?.()
    },
    [createJobFile, createJob, profile, t, onFileUploaded]
  )

  if (!profile) {
    return null
  }

  return (
    <Dialog
      data-testid={generateTestId(TestId.UPLOAD_JOB_FILE_MODAL)}
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            data-testid={generateTestId(TestId.UPLOAD_JOB_FILE_MODAL_TITLE)}
            variant="h6"
          >
            {modalTitle}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <FileUploadDropzone
          onFileUpload={handleFileUpload}
          acceptedFileTypes={acceptedFileTypes.join(',')}
          maxFileSize={5242880}
        />
      </DialogContent>
    </Dialog>
  )
}

export default UploadJobFileModal
