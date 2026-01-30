import React, { ChangeEvent, DragEvent, useRef, useState } from 'react'
import { Alert, Box, Typography, styled } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Button from '../../atoms/buttons/Button'
import { useTranslation } from 'next-i18next'
import { TestId, generateTestId } from '../../../utils/testIds'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const DropZone = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragging',
})<{ isDragging: boolean }>(({ theme, isDragging }) => ({
  border: `2px dashed ${
    isDragging ? theme.palette.primary.main : theme.palette.divider
  }`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(5, 3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  backgroundColor: isDragging ? theme.palette.action.hover : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}))

interface IFileUploadDropzoneProps {
  onFileUpload: (file: File) => void
  acceptedFileTypes?: string
  maxFileSize?: number // in bytes
  showInfo?: boolean
}

function FileUploadDropzone(props: IFileUploadDropzoneProps): JSX.Element {
  const {
    onFileUpload,
    acceptedFileTypes = '*',
    maxFileSize = 5242880,
    showInfo = true,
  } = props

  const { t } = useTranslation('common')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert accepted file types to proper format for HTML accept attribute
  const getAcceptAttribute = (): string => {
    if (acceptedFileTypes === '*') {
      return '*'
    }

    // Ensure extensions start with a dot
    return acceptedFileTypes
      .split(',')
      .map((type) => {
        const trimmed = type.trim()
        return trimmed.startsWith('.') ? trimmed : `.${trimmed}`
      })
      .join(',')
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const validateFile = (file: File): boolean => {
    setError(null)

    if (maxFileSize && file.size > maxFileSize) {
      setError(
        t('upload.error.fileSizeExceeds', {
          size: (maxFileSize / 1048576).toFixed(2),
        })
      )
      return false
    }

    if (acceptedFileTypes !== '*') {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const acceptedExtensions = acceptedFileTypes
        .split(',')
        .map((type) => type.trim().replace('.', ''))

      if (fileExtension && !acceptedExtensions.includes(fileExtension)) {
        setError(
          t('upload.error.fileTypeNotAccepted', {
            types: acceptedFileTypes,
          })
        )
        return false
      }
    }

    return true
  }

  const processFiles = (files: FileList | null): void => {
    if (files && files.length > 0) {
      const [file] = files
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    processFiles(e.dataTransfer.files)
  }

  const handleDropZoneClick = (): void => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    processFiles(e.target.files)
  }

  const handleUpload = (): void => {
    if (selectedFile) {
      onFileUpload(selectedFile)
      setSelectedFile(null)
    }
  }

  return (
    <Box data-testid={generateTestId(TestId.FILE_UPLOAD_DROPZONE)}>
      <DropZone
        data-testid={generateTestId(TestId.FILE_UPLOAD_DROPZONE, 'dropzone')}
        isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
      >
        <VisuallyHiddenInput
          data-testid={generateTestId(TestId.FILE_UPLOAD_DROPZONE, 'input')}
          ref={fileInputRef}
          type="file"
          accept={getAcceptAttribute()}
          onChange={handleFileSelect}
        />
        {selectedFile ? (
          <>
            <UploadFileIcon
              sx={{
                fontSize: 64,
                color: (theme) => theme.palette.success.main,
                mb: 2,
              }}
            />
            <Typography
              data-testid="selectedFileName"
              variant="h6"
              gutterBottom
            >
              {selectedFile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('upload.fileSize', {
                size: (selectedFile.size / 1048576).toFixed(2),
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('upload.clickToChange')}
            </Typography>
          </>
        ) : (
          <>
            <CloudUploadIcon
              sx={{
                fontSize: 64,
                color: (theme) => theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography variant="body1" gutterBottom>
              {t('upload.dragAndDrop')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
              {t('upload.orClickToBrowse')}
            </Typography>
          </>
        )}
      </DropZone>

      {selectedFile ? (
        <Box sx={{ mt: 2 }}>
          <Button
            data-testid={generateTestId(TestId.BUTTON, 'upload')}
            variant="contained"
            color="primary"
            startIcon={<UploadFileIcon />}
            onClick={handleUpload}
            fullWidth
          >
            {t('upload.validate')}
          </Button>
        </Box>
      ) : null}

      {error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : null}

      {showInfo ? (
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" display="block" color="text.secondary">
            {t('upload.acceptedFileTypes', { types: acceptedFileTypes })}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            {t('upload.maximumFileSize', {
              size: (maxFileSize / 1048576).toFixed(2),
            })}
          </Typography>
        </Box>
      ) : null}
    </Box>
  )
}

export default FileUploadDropzone
