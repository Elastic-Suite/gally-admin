import React, { FunctionComponent, useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import { PageTitle } from '../../../../components'
import { withAuth, withOptions } from '../../../../hocs'
import { breadcrumbContext } from '../../../../contexts'

import {
  IJobProfilesByType,
  IRouterTab,
} from '@elastic-suite/gally-admin-shared'
import { useFetchApi, useTabs } from '../../../../hooks'
import CustomTabs from '../../../../components/molecules/layout/tabs/CustomTabs'
import AdminImport from '../../../../components/stateful-pages/ImportExport/Import'
import AdminExport from '../../../../components/stateful-pages/ImportExport/Export'

const pagesSlug = ['analyze', 'import_export']
const componentsByProfile: Record<string, FunctionComponent> = {
  import: AdminImport,
  export: AdminExport,
}

function AdminImportExportIndex(): JSX.Element {
  const { t } = useTranslation('importExport')
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  const [jobProfiles] = useFetchApi<IJobProfilesByType>(`job_profiles`)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

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
        },
        id: tabs.length,
        label: t(`tabs.${profile}`),
        url: `/admin/analyze/importexport/${profile}`,
      })
    }

    return tabs
  }, [jobProfiles, t])

  const [activeTab, handleTabChange] = useTabs(routerTabs)

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
