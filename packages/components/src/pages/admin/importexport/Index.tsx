import React, { FunctionComponent, useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import { PageTitle } from '../../../components'
import { withAuth, withOptions } from '../../../hocs'
import { breadcrumbContext } from '../../../contexts'

import {
  IJobProfileInfos,
  IJobProfiles,
  IJobProfilesByType,
  IRouterTab,
} from '@elastic-suite/gally-admin-shared'
import { useFetchApi, useTabs } from '../../../hooks'
import CustomTabs from '../../../components/molecules/layout/tabs/CustomTabs'
import AdminImport from '../../../components/stateful-pages/ImportExport/Import'
import AdminExport from '../../../components/stateful-pages/ImportExport/Export'

const pagesSlug = 'import_export'
const componentsByProfile: Record<string, FunctionComponent> = {
  import: AdminImport,
  export: AdminExport,
}

function getDefaultProfile(profiles: IJobProfiles): IJobProfileInfos {
  const params = new URLSearchParams(window.location.search)
  const profileFromUrl =
    params.get('import_profile') || params.get('export_profile')
  return profileFromUrl && profiles[profileFromUrl]
    ? profiles[profileFromUrl]
    : Object.values(profiles)[0]
}

function AdminImportExportIndex(): JSX.Element {
  const { t } = useTranslation('importExport')
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  const [jobProfiles] = useFetchApi<IJobProfilesByType>(`job_profiles`)

  const routerTabs: IRouterTab[] = useMemo(() => {
    if (!jobProfiles?.data?.profiles) {
      return []
    }

    const tabs: IRouterTab[] = []
    for (const profile of Object.keys(jobProfiles.data.profiles)) {
      tabs.push({
        Component: componentsByProfile[profile],
        componentProps: {
          profiles: jobProfiles.data.profiles[profile],
          defaultProfile: getDefaultProfile(jobProfiles.data.profiles[profile]),
        },
        id: tabs.length,
        label: t(`tabs.${profile}`),
        url: `/admin/importexport/${profile}`,
      })
    }

    return tabs
  }, [jobProfiles, t])

  const [activeTab, handleTabChange] = useTabs(routerTabs)

  useEffect(() => {
    const { slug } = router.query
    setBreadcrumb([pagesSlug, ...slug])
  }, [router.query, activeTab, setBreadcrumb])

  const pageTitle = t('importexport')

  const headTitle = useMemo(() => {
    return activeTab ? `${pageTitle} - ${activeTab.label}` : ''
  }, [activeTab, pageTitle])

  if (!jobProfiles?.data?.profiles) {
    return null
  }

  const { actions, id } = activeTab

  return (
    <>
      <PageTitle headTitle={headTitle} title={pageTitle}>
        {actions}
      </PageTitle>
      <CustomTabs
        defaultActiveId={id}
        onChange={handleTabChange}
        tabs={routerTabs}
      />
    </>
  )
}

export default withAuth()(withOptions(AdminImportExportIndex))
