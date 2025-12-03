import React, { useState } from 'react'
import {
  IJobProfileInfos,
  IJobProfiles,
  isError,
} from '@elastic-suite/gally-admin-shared'
import RunnableProfileGrid from '../../organisms/RunnableJobProfileGrid/RunnableJobProfileGrid'
import FileUploadDropzone from '../../atoms/FileUploadDropzone/FileUploadDropzone'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useResource, useResourceOperations } from '../../../hooks'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useTranslation } from 'next-i18next'

interface IProps {
  profiles: IJobProfiles
}

function AdminImport(props: IProps): JSX.Element {
  const fixedFilters = {
    type: 'import',
  }
  const { profiles } = props

  const { t } = useTranslation('jobs')
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false)
  const [currentProfile, setCurrentProfile] = useState<IJobProfileInfos>(null)
  const jobFileResource = useResource('JobFile')
  const { create: createJobFile } = useResourceOperations(jobFileResource)
  const jobResource = useResource('Job')
  const { create: createJob } = useResourceOperations(jobResource)

  function handleProfileRun(profile: IJobProfileInfos): void {
    setCurrentProfile(profile)
    setIsUploadFileModalOpen(true)
  }

  function handleClose(): void {
    setIsUploadFileModalOpen(false)
  }

  async function handleFileUpload(file: File): Promise<void> {
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
      profile: currentProfile.profile,
      file: sendingJobFileInfosToApi['@id'],
    })

    if (isError(sendingJobToApi)) {
      enqueueSnackbar(t('error.createJob'), {
        onShut: closeSnackbar,
        variant: 'error',
      })
      return
    }

    enqueueSnackbar(t('success.jobCreated'), {
      onShut: closeSnackbar,
      variant: 'success',
    })

    setIsUploadFileModalOpen(false)
  }

  return (
    <>
      <RunnableProfileGrid
        defaultProfile={Object.values(profiles)[0]}
        fixedFilters={fixedFilters}
        profiles={profiles}
        onProfileRun={handleProfileRun}
      />
      {currentProfile ? (
        <Dialog
          open={isUploadFileModalOpen}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">{currentProfile.label}</Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
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
              acceptedFileTypes=".csv"
              maxFileSize={10485760}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  )
}

export default AdminImport
