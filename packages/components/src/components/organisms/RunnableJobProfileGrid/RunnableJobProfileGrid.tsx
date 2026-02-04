import React, { useCallback, useState } from 'react'
import { useFilters, useResource } from '../../../hooks'
import ProfileRunner from '../../atoms/profileRunner/ProfileRunner'
import { ResourceTable } from '../../index'
import {
  IJobProfileInfos,
  IJobProfiles,
  ISearchParameters,
} from '@elastic-suite/gally-admin-shared'
import Alert from '../../atoms/Alert/Alert'
import { INoAttributesProps } from '../../atoms/noAttributes/NoAttributes'
import { Trans } from 'next-i18next'

interface IProps {
  fixedFilters: ISearchParameters
  profiles: IJobProfiles
  defaultProfile: IJobProfileInfos
  onProfileRun: (profile: IJobProfileInfos) => void
  pendingJobsCount: number
  runProfileButtonLabel?: string
  componentId?: string
  noAttributesProps?: INoAttributesProps
}

function RunnableJobProfileGrid(props: IProps): JSX.Element {
  const {
    fixedFilters,
    profiles,
    defaultProfile,
    onProfileRun,
    pendingJobsCount = 0,
    runProfileButtonLabel,
    componentId,
    noAttributesProps,
  } = props

  const resource = useResource('Job')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [showPendingJobsAlert, setShowPendingJobsAlert] = useState(true)

  const runProfile = useCallback(
    (profile: IJobProfileInfos) => {
      onProfileRun(profile)
    },
    [onProfileRun]
  )

  if (!resource) {
    return null
  }

  return (
    <>
      <ProfileRunner
        profiles={profiles}
        defaultProfile={defaultProfile}
        onProfileRun={runProfile}
        runProfileButtonLabel={runProfileButtonLabel}
        componentId={componentId}
      />
      {Boolean(pendingJobsCount) && showPendingJobsAlert ? (
        <>
          <Alert
            variant="info"
            style={{ marginBottom: 0 }}
            onShut={(): void => setShowPendingJobsAlert(false)}
          >
            <Trans
              ns="common"
              i18nKey="job.pendingCount"
              count={pendingJobsCount}
              values={{ value: pendingJobsCount }}
              components={[<strong key="0" />]}
            />
          </Alert>
        </>
      ) : null}
      <ResourceTable
        refreshTable={pendingJobsCount}
        activeFilters={activeFilters}
        filters={fixedFilters}
        resourceName="Job"
        setActiveFilters={setActiveFilters}
        showSearch={false}
        noAttributesProps={noAttributesProps}
      />
    </>
  )
}

export default RunnableJobProfileGrid
