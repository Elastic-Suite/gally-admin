import React, { useMemo } from 'react'
import { withAuth, withOptions } from '../../../hocs'
import { useFetchApi, useTabs } from '../../../hooks'
import {
  IConfigurationTreeData,
  IRouterTab,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'
import ConfigurationForm from '../ConfigurationForm/ConfigurationForm'
import SubTabs from '../../atoms/subTabs/SubTabs'
import { extractDataFromConfigurationTree } from '../../../services/configuration'

function SettingsConfigurations(): JSX.Element {
  const [configurationTree] =
    useFetchApi<IConfigurationTreeData>('configuration_tree')

  const routerTabs: IRouterTab[] = useMemo(() => {
    if (configurationTree.status !== LoadStatus.SUCCEEDED) {
      return []
    }
    const [
      configurationResource,
      configurationGroups,
      configurationScopes,
      configurationList,
    ] = extractDataFromConfigurationTree(configurationTree?.data?.configTree)
    return configurationGroups.map((group, index) => ({
      Component: ConfigurationForm,
      componentProps: {
        configurationResource: configurationResource[group.code],
        configurationGroup: group,
        configurationScope: configurationScopes[group.scopeType],
        configurationList: configurationList[group.code],
      },
      id: index,
      default: index === 0 ? true : undefined,
      label: group.label,
      url: `/admin/settings/scope/configurations/${group.code}`,
    }))
  }, [configurationTree])

  const [activeTab, handleTabChange] = useTabs(routerTabs)
  const id = activeTab?.id

  if (configurationTree.status !== LoadStatus.SUCCEEDED) {
    return null
  }

  return (
    <SubTabs
      componentId="configurationsGroups"
      defaultActiveId={id}
      onChange={handleTabChange}
      tabs={routerTabs}
    />
  )
}

export default withAuth()(withOptions(SettingsConfigurations))
