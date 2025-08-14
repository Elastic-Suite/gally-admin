import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import { breadcrumbContext } from '../../../contexts'
import { withAuth, withOptions } from '../../../hocs'
import { useTabs, useUser } from '../../../hooks'
import { selectMenu, useAppSelector } from '../../../store'
import {
  IRouterTab,
  Role,
  findBreadcrumbLabel,
  isValidRoleUser,
} from '@elastic-suite/gally-admin-shared'

import PageTitle from '../../../components/atoms/PageTitle/PageTitle'
import CustomTabs from '../../../components/molecules/layout/tabs/CustomTabs'
import SettingsAttributes from '../../../components/stateful-pages/SettingsAttributes/SettingsAttributes'
import SettingsScope from '../../../components/stateful-pages/SettingsScope/SettingsScope'
import AdminUserGrid from '../../../components/stateful-pages/SettingsUsers/Grid'
import SettingsConfigurations from "../../../components/stateful-pages/SettingsConfigurations/SettingsConfigurations";

const pageSlug = 'settings'

function AdminSettingsIndex(): JSX.Element {
  const { t } = useTranslation(pageSlug)
  const router = useRouter()
  const menu = useAppSelector(selectMenu)
  const user = useUser()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    const { slug } = router.query
    setBreadcrumb([pageSlug, ...slug])
  }, [router.query, setBreadcrumb])

  const routerTabs: IRouterTab[] = useMemo(() => {
    return [
      {
        Component: SettingsScope,
        default: true,
        id: 0,
        label: t('tabs.scope'),
        url: '/admin/settings/scope',
      },
      {
        // actions: <Button>{t('action.import')} (xlsx)</Button>,
        Component: SettingsAttributes,
        id: 1,
        label: t('tabs.attributes'),
        url: '/admin/settings/attributes',
      },
      {
        Component: SettingsConfigurations,
        id: 2,
        label: t('tabs.configurations'),
        url: '/admin/settings/configurations',
      },
      isValidRoleUser(Role.ADMIN, user) && {
        Component: AdminUserGrid,
        id: 3,
        label: t('tabs.users'),
        url: '/admin/settings/user/grid',
      },
    ]
  }, [t, user])
  const [activeTab, handleTabChange] = useTabs(routerTabs)
  const { actions, id } = activeTab

  return (
    <>
      <PageTitle title={findBreadcrumbLabel(0, [pageSlug], menu.hierarchy)}>
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

export default withAuth()(withOptions(AdminSettingsIndex))
