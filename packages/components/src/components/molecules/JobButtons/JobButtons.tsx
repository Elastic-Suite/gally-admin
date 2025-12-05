import React, { ReactNode, useMemo } from 'react'
import { useRouter } from 'next/router'
import Button from '../../atoms/buttons/Button'
import { TestId, generateTestId } from '../../../utils/testIds'
import { IJobConfig } from '@elastic-suite/gally-admin-shared'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useTranslation } from 'next-i18next'

interface IFlatJobConfig extends IJobConfig {
  jobKey: string
}

interface IJobButtonsProps {
  resourceName: string
  jobButtons: Record<string, IJobConfig | IJobConfig[]>
  propsButton?: Record<string, any>
}

const jobProfilesButtonsToIcons: Record<string, ReactNode> = {
  import_profile: <CloudUploadIcon />,
  export_profile: <CloudDownloadIcon />,
}

function JobButtons({
  resourceName,
  jobButtons,
  propsButton,
}: IJobButtonsProps): JSX.Element | null {
  const { t } = useTranslation('api')
  const router = useRouter()

  const flatJobConfigs = useMemo(() => {
    const flat: IFlatJobConfig[] = []

    Object.entries(jobButtons).forEach(([jobKey, jobConfigs]) => {
      const configs = Array.isArray(jobConfigs) ? jobConfigs : [jobConfigs]
      configs.forEach((config) => {
        flat.push({
          ...config,
          jobKey,
        })
      })
    })

    return flat
  }, [jobButtons])

  const navigateToImportExportPage = async (
    jobKey: string,
    jobProfile: string
  ): Promise<void> => {
    await router.push(
      `/admin/importexport/${jobKey.split('_')[0]}?${jobKey}=${jobProfile}`
    )
  }

  if (flatJobConfigs.length === 0) {
    return null
  }

  return (
    <>
      {flatJobConfigs.map((config) => (
        <Button
          key={`${config.jobKey}-${config.profile}`}
          {...{
            ...propsButton,
            display: 'secondary',
            endIcon: jobProfilesButtonsToIcons[config.jobKey],
          }}
          data-testid={generateTestId(
            TestId.GRID_JOB_BUTTON,
            `${config.profile}|${resourceName}`
          )}
          onClick={async (): Promise<void> => {
            await navigateToImportExportPage(config.jobKey, config.profile)
          }}
        >
          {t(config.label)}
        </Button>
      ))}
    </>
  )
}

export default JobButtons
