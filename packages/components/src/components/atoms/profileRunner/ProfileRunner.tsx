import React, { useCallback, useMemo, useState } from 'react'
import {
  IJobProfileInfos,
  IJobProfiles,
} from '@elastic-suite/gally-admin-shared'

import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'

import DropDownWithoutError from '../form/DropDownWithoutError'
import Button from '../buttons/Button'
import { TestId, generateTestId } from '../../../utils/testIds'
import { Paper } from '@mui/material'

interface IProps {
  profiles: IJobProfiles
  defaultProfile: IJobProfileInfos
  onProfileRun: (profile: IJobProfileInfos) => void
  runProfileButtonLabel?: string
  componentId?: string
}

const Container = styled(Paper)(({ theme }) => ({
  alignItems: 'center',
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  boxShadow: 'none',
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}))

const Title = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  fontSize: theme.spacing(1.9),
  fontWeight: 'normal',
  lineHeight: '20px',
}))

function ProfileRunner(props: IProps): JSX.Element {
  const {
    profiles,
    defaultProfile,
    onProfileRun,
    runProfileButtonLabel,
    componentId,
  } = props
  const { t } = useTranslation('importExport')
  const [currentProfile, setCurrentProfile] =
    useState<IJobProfileInfos>(defaultProfile)

  const profileOptions = useMemo(
    () =>
      Object.values(profiles)?.map((item: IJobProfileInfos) => ({
        label: item.label,
        value: item.profile,
      })),
    [profiles]
  )

  const handleProfileChange = useCallback(
    (value: string) => {
      const selected = Object.values(profiles).find((p) => p.profile === value)
      if (selected) {
        setCurrentProfile(selected)
      }
    },
    [profiles]
  )

  return (
    <Container>
      <Title>{t('profile')}</Title>
      <DropDownWithoutError
        options={profileOptions}
        value={currentProfile.profile}
        onChange={handleProfileChange}
        componentId={generateTestId(TestId.JOBPROFILE, componentId)}
        required
      />
      <Button
        type="submit"
        data-testid={generateTestId(
          TestId.IMPORT_EXPORT_PROFILE_RUN,
          componentId
        )}
        onClick={(): void => onProfileRun(currentProfile)}
      >
        {runProfileButtonLabel ?? t('profile.run')}
      </Button>
    </Container>
  )
}

export default ProfileRunner
