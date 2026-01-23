import React, { useState } from 'react'
import Button from '../../atoms/buttons/Button'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import { LoadStatus, fetchApiFile } from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { TestId, generateTestId } from '../../../utils/testIds'

interface IProps {
  fileAPIUrl: string
  componentId?: string
  contentType?: string
}

interface IFileInfos {
  content: string | null
  contentType: string | null
  filename: string | null
}

function FileDownloader(props: IProps): JSX.Element {
  const { fileAPIUrl, componentId, contentType } = props

  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(false)
  const [fileInfos, setFileInfos] = useState<IFileInfos | null>(null)

  function triggerDownload(fileInfos: IFileInfos): void {
    if (!fileInfos) {
      return
    }

    const blob = new Blob([fileInfos.content], { type: fileInfos.contentType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    const extension = (contentType ?? fileInfos.contentType)?.split('/')[1]
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const defaultFileName = `file-${timestamp}.${extension}`

    link.href = url
    link.download = fileInfos.filename ?? defaultFileName
    link.click()

    window.URL.revokeObjectURL(url)
  }

  function handleFileDownload(): void {
    if (!fileInfos && !isLoading) {
      fetchApiFile(fileAPIUrl).then(
        ({ content, contentType, filename, status }) => {
          if (status !== LoadStatus.SUCCEEDED) {
            enqueueSnackbar(t('download.error'), {
              onShut: closeSnackbar,
              variant: 'error',
            })
          } else {
            setFileInfos({ content, contentType, filename })
            triggerDownload({ content, contentType, filename })
          }
          setIsLoading(false)
        }
      )
    }

    if (fileInfos) {
      triggerDownload(fileInfos)
    }
  }

  return (
    <>
      <Button
        componentId={generateTestId(TestId.FILE_DOWNLOADER, componentId)}
        display="secondary"
        size="small"
        startIcon={<CloudDownloadIcon />}
        onClick={handleFileDownload}
        disabled={isLoading}
      >
        {t('download.file')}
      </Button>
    </>
  )
}

export default FileDownloader
