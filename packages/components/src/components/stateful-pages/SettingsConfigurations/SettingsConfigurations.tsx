import React, {useMemo} from 'react'
import { withAuth, withOptions } from '../../../hocs'
import { useFetchApi, useTabs} from '../../../hooks'
import { IConfigurationTreeScopes, IRouterTab, IConfigurationTree, IResource, IConfigurationTreeGroupFormatted, IConfigurationTreeData, IGallyClass, IField, LoadStatus } from '@elastic-suite/gally-admin-shared'
import ConfigurationForm from "../ConfigurationForm/ConfigurationForm";
import SubTabs from "../../atoms/subTabs/SubTabs";

interface IResources {
  [key: string]: IResource
}

interface IConfigList {
  [key: string]: string[]
}

// todo move to service et découper en plusieurs fonctions pour simplifier la lecture du code.
function extractDataFromConfigurationTree(configurationTree: IConfigurationTree): [IResources, IConfigurationTreeGroupFormatted[], IConfigurationTreeScopes, IConfigList] {
  const configurationTreeClone: IConfigurationTree = JSON.parse(JSON.stringify(configurationTree))
  let groups: IConfigurationTreeGroupFormatted[] = []
  let configList: IConfigList = {}
  let resources: IResources = {}
  //todo: gérer la position pour les groups une fois que ça sera fait par le Back.
  for (let [groupCode, group] of Object.entries(configurationTreeClone.groups)) {
    groups.push({code: groupCode, label: group.label, scopeType: group.scopeType})
    let fieldsets: IGallyClass = {fieldset: {}}
    let fields: IField[] = []
    for (let [fieldsetCode, fieldset] of Object.entries(group.fieldsets)) {
      fieldsets.fieldset = {...fieldsets.fieldset, [fieldsetCode]: {label: fieldset.label, position: fieldset.position, tooltip: fieldset.tooltip}}
      for (let [fieldCode, field] of Object.entries(fieldset.fields)) {
        (configList[groupCode] ??= []).push(fieldCode)
        field = {...field, fieldset: fieldsetCode}
        fields.push({
          '@type': '',
          description: field.label,
          property: {
            '@id': `#Configuration\\${fieldCode}`,
            '@type': '',
            domain: {
              '@id': '',
            },
            label: field.label,
          },
          readable:  true,
          required: field?.required ?? true,
          title: fieldCode,
          writeable: true,
          gally: field
        })
      }
    }
    resources[groupCode] ??= {
      label: '',
      supportedOperation: [],
      supportedProperty: fields,
      title: '',
      url: '',
      gally: fieldsets
    } as IResource
  }

  return [
    resources,
    groups,
    configurationTreeClone.scopes,
    configList,
  ]
}

function SettingsConfigurations(): JSX.Element {
   // const { t } = useTranslation('configuration')
  const [configurationTree] = useFetchApi<IConfigurationTreeData>('configuration_tree')

  const routerTabs: IRouterTab[] = useMemo(
    () => {
      if (configurationTree.status !== LoadStatus.SUCCEEDED) {
        return []
      }
      const [configurationResource, configurationGroups, configurationScopes, configurationList] = extractDataFromConfigurationTree(configurationTree?.data?.configTree)
      return configurationGroups.map((group, index) => (
        {
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
        }
      ))},
    [configurationTree]
  )

  const [activeTab, handleTabChange] = useTabs(routerTabs)
  const id = activeTab?.id

  if (configurationTree.status !== LoadStatus.SUCCEEDED) {
    return null
  }

  return (
      <SubTabs
        defaultActiveId={id}
        onChange={handleTabChange}
        tabs={routerTabs}
      />
  )
}

export default withAuth()(withOptions(SettingsConfigurations))
