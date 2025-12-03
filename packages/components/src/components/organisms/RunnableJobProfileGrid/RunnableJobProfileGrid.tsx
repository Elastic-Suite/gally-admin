import React from 'react'
import { useFilters, useResource } from '../../../hooks'
import ProfileRunner from '../../atoms/profileRunner/ProfileRunner'
import { ResourceTable } from '../../index'
import {
  IJobProfileInfos,
  IJobProfiles,
  ISearchParameters,
} from '@elastic-suite/gally-admin-shared'

interface IProps {
  fixedFilters: ISearchParameters
  profiles: IJobProfiles
  defaultProfile: IJobProfileInfos
  onProfileRun: (profile: IJobProfileInfos) => void
}

function RunnableJobProfileGrid(props: IProps): JSX.Element {
  const { fixedFilters, profiles, defaultProfile, onProfileRun } = props

  const resource = useResource('Job')
  const [activeFilters, setActiveFilters] = useFilters(resource)

  if (!resource) {
    return null
  }

  function runProfile(profile: IJobProfileInfos): void {
    onProfileRun(profile)
  }

  return (
    <>
      <ProfileRunner
        profiles={profiles}
        defaultProfile={defaultProfile}
        onProfileRun={runProfile}
      />
      <ResourceTable
        activeFilters={activeFilters}
        filters={fixedFilters}
        resourceName="Job"
        setActiveFilters={setActiveFilters}
        showSearch={false}
      />
    </>
  )
}

export default RunnableJobProfileGrid
