import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  IJobProfileInfos,
  IJobProfiles,
} from '@elastic-suite/gally-admin-shared'
import RunnableProfileGrid from '../../organisms/RunnableJobProfileGrid/RunnableJobProfileGrid'
import UploadJobFileModal from '../../molecules/UploadJobFileModal/UploadJobFileModal'
import { useTranslation } from 'next-i18next'

interface IProps {
  profiles: IJobProfiles
  defaultProfile: IJobProfileInfos
}

function AdminImport(props: IProps): JSX.Element {
  const { profiles, defaultProfile } = props
  const { t } = useTranslation('importExport')
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false)
  const [currentProfile, setCurrentProfile] = useState<IJobProfileInfos | null>(
    null
  )
  const [pendingJobsCount, setPendingJobsCount] = useState(0)

  const fixedFilters = useMemo(
    () => ({
      type: 'import',
    }),
    []
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const profileFromUrl = params.get('import_profile')

    if (profileFromUrl && profiles[profileFromUrl]) {
      setCurrentProfile(profiles[profileFromUrl])
      setIsUploadFileModalOpen(true)
    }
  }, [profiles])

  const handleProfileRun = useCallback((profile: IJobProfileInfos) => {
    setCurrentProfile(profile)
    setIsUploadFileModalOpen(true)
  }, [])

  function handleClose(): void {
    setIsUploadFileModalOpen(false)
  }

  function handleFileUploaded(): void {
    setPendingJobsCount((prev) => prev + 1)
    setIsUploadFileModalOpen(false)
  }

  return (
    <>
      <RunnableProfileGrid
        defaultProfile={currentProfile ?? defaultProfile}
        fixedFilters={fixedFilters}
        profiles={profiles}
        onProfileRun={handleProfileRun}
        pendingJobsCount={pendingJobsCount}
        runProfileButtonLabel={t('import.run')}
        componentId="import"
        noAttributesProps={{
          title: t('import.none'),
        }}
      />
      <UploadJobFileModal
        isOpen={isUploadFileModalOpen}
        profile={currentProfile}
        onClose={handleClose}
        onFileUploaded={handleFileUploaded}
      />
    </>
  )
}

export default AdminImport
