import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import { PageTitle } from '../../../../components'
import { selectMenu, useAppSelector } from '../../../../store'
import { withAuth, withOptions } from '../../../../hocs'
import { breadcrumbContext } from '../../../../contexts'

import {
  IRouterTab,
  findBreadcrumbLabel,
} from '@elastic-suite/gally-admin-shared'
import { useTabs } from '../../../../hooks'
import CustomTabs from '../../../../components/molecules/layout/tabs/CustomTabs'
import AdminImport from '../../../../components/stateful-pages/ImportExport/Import'
import AdminExport from '../../../../components/stateful-pages/ImportExport/Export'

const pageSlug = 'importexport'

function AdminImportExportIndex(): JSX.Element {
  const { t } = useTranslation(pageSlug)
  const router = useRouter()
  const menu = useAppSelector(selectMenu)
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    const { slug } = router.query
    setBreadcrumb([pageSlug, ...slug])
  }, [router.query, setBreadcrumb])
  const routerTabs: IRouterTab[] = useMemo(() => {
    const tabs: IRouterTab[] = [
      {
        Component: AdminImport,
        default: true,
        id: 0,
        label: t('tabs.import'),
        url: '/admin/analyze/importexport/import',
      },
      {
        Component: AdminExport,
        id: 1,
        label: t('tabs.export'),
        url: '/admin/analyze/importexport/export',
      },
    ]
    return tabs
  }, [t])

  const [activeTab, handleTabChange] = useTabs(routerTabs)
  const { actions, id } = activeTab

  const pageTitle = useMemo(() => {
    return findBreadcrumbLabel(0, [pageSlug], menu.hierarchy)
      ? `${findBreadcrumbLabel(0, [pageSlug], menu.hierarchy)}`
      : ''
  }, [menu])

  const headTitle = useMemo(() => {
    return `${pageTitle} - ${activeTab.label}`
  }, [pageTitle, activeTab.label])

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
