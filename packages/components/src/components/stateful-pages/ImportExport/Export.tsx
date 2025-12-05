import React from 'react'
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
  profiles: IJobProfiles
}

function AdminExport(props: IProps): JSX.Element {
  const fixedFilters = {
    type: 'export',
  }

  const { profiles } = props
  const { t } = useTranslation('importExport')
  const jobResource = useResource('Job')
  const { create: createJob } = useResourceOperations(jobResource)

  async function onProfileRun(profile: IJobProfileInfos): Promise<void> {
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
  }

  return (
    <RunnableProfileGrid
      defaultProfile={Object.values(profiles)[0]}
      fixedFilters={fixedFilters}
      profiles={profiles}
      onProfileRun={onProfileRun}
    />
  )
}

export default AdminExport
