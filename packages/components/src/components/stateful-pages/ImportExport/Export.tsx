import React, { useEffect, useMemo, useState } from 'react'
import {
  IJobProfileInfos,
  IJobProfiles,
  isError,
} from '@elastic-suite/gally-admin-shared'
import RunnableProfileGrid from '../../organisms/RunnableJobProfileGrid/RunnableJobProfileGrid'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import { useTranslation } from 'next-i18next'
import { useResource, useResourceOperations } from '../../../hooks'

interface IProps {
  active?: boolean
  profiles: IJobProfiles
  defaultProfile: IJobProfileInfos
}

function AdminExport(props: IProps): JSX.Element {
  const { active, profiles, defaultProfile } = props
  const { t } = useTranslation('importExport')
  const jobResource = useResource('Job')
  const { create: createJob } = useResourceOperations(jobResource)
  const [pendingJobsCount, setPendingJobsCount] = useState(0)
  const [currentProfile, setCurrentProfile] = useState<IJobProfileInfos | null>(
    null
  )

  const fixedFilters = useMemo(
    () => ({
      type: 'export',
    }),
    []
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const profileFromUrl = params.get('export_profile')

    if (profileFromUrl && profiles[profileFromUrl]) {
      setCurrentProfile(profiles[profileFromUrl])
    }
  }, [profiles])

  async function handleProfileRun(profile: IJobProfileInfos): Promise<void> {
    const sendingJobToApi = await createJob({
      type: 'export',
      profile: profile.profile,
    })

    if (isError(sendingJobToApi)) {
      enqueueSnackbar(t('error.createExportJob'), {
        onShut: closeSnackbar,
        variant: 'error',
      })
      return
    }

    enqueueSnackbar(t('success.exportJobCreated'), {
      onShut: closeSnackbar,
      variant: 'success',
    })

    setPendingJobsCount((prev) => prev + 1)
  }

  return (
    <>
      <RunnableProfileGrid
        active={active}
        defaultProfile={currentProfile ?? defaultProfile}
        fixedFilters={fixedFilters}
        profiles={profiles}
        onProfileRun={handleProfileRun}
        pendingJobsCount={pendingJobsCount}
        runProfileButtonLabel={t('export.run')}
        componentId="export"
        noAttributesProps={{
          title: t('export.none'),
        }}
      />
    </>
  )
}

export default AdminExport
