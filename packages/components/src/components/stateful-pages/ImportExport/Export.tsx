import React from 'react'
import {
  IJobProfileInfos,
  IJobProfiles,
} from '@elastic-suite/gally-admin-shared'
import RunnableProfileGrid from '../../organisms/RunnableJobProfileGrid/RunnableJobProfileGrid'
interface IProps {
  profiles: IJobProfiles
}

function AdminExport(props: IProps): JSX.Element {
  const fixedFilters = {
    type: 'export',
  }

  const { profiles } = props

  function onProfileRun(item: IJobProfileInfos): void {
    console.log(item)
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
