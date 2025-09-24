import {
  ConfigurationScopeType,
  IConfiguration,
  IConfigurationData,
  IConfigurationTree,
  IConfigurationTreeGroup,
  IConfigurationTreeGroupFieldsetsField,
  IConfigurationTreeGroupFormatted,
  IConfigurationTreeScope,
  IConfigurationTreeScopes,
  IField,
  IGallyClass,
  IGallyProperty,
  IResource,
} from '@elastic-suite/gally-admin-shared'

type IResources = Record<string, IResource>
type IConfigList = Record<string, string[]>
type IConfigFieldsetFieldWithFieldSet =
  IConfigurationTreeGroupFieldsetsField & {
    fieldset: string
  }

export function getConfigurationData(
  configurationList: string[],
  configurations: IConfiguration[]
): IConfigurationData {
  let data = {}
  configurationList.forEach((value) => {
    const configuration = configurations.find((item) => item.path === value)
    if (configuration) {
      data = { ...data, [value]: configuration.value }
    }
  })

  return data
}

export function getBulkConfigurations(
  configurationData: IConfigurationData,
  scopeType: ConfigurationScopeType,
  scopeCode: string
): IConfiguration[] {
  const bulk: IConfiguration[] = []
  const isGeneralScope = scopeCode === null
  for (const [path, value] of Object.entries(configurationData)) {
    bulk.push({
      path,
      value,
      scopeType: isGeneralScope
        ? ConfigurationScopeType.SCOPE_GENERAL
        : scopeType,
      scopeCode: isGeneralScope ? null : scopeCode,
    })
  }

  return bulk
}

function formatField(
  id: string,
  description: string,
  label: string,
  title: string,
  required: boolean,
  gally: IGallyProperty
): IField {
  return {
    '@type': '',
    description,
    property: {
      '@id': id,
      '@type': '',
      domain: {
        '@id': '',
      },
      label,
    },
    readable: true,
    required,
    title,
    writeable: true,
    gally,
  }
}

export function formatConfigurationScopeField(
  configurationGroup: IConfigurationTreeGroupFormatted,
  configurationScope: IConfigurationTreeScope
): IField {
  return formatField(
    `#Configuration\\configurationScopeType\\${configurationGroup.scopeType}`,
    configurationScope.label,
    configurationScope.label,
    configurationScope.label,
    true,
    { options: configurationScope.options }
  )
}

function formatConfigurationField(
  field: IConfigFieldsetFieldWithFieldSet,
  fieldCode: string
): IField {
  return formatField(
    `#Configuration\\${fieldCode}`,
    field.label,
    field.label,
    fieldCode,
    field?.required ?? true,
    field
  )
}

function getSortedConfigurationTreeGroupsByPosition(
  configurationTreeGroups: Record<string, IConfigurationTreeGroup>
): [string, IConfigurationTreeGroup][] {
  return Object.entries(configurationTreeGroups).sort(
    (a, b) => a[1].position - b[1].position
  )
}

export function extractDataFromConfigurationTree(
  configurationTree: IConfigurationTree
): [
  IResources,
  IConfigurationTreeGroupFormatted[],
  IConfigurationTreeScopes,
  IConfigList
] {
  const configurationTreeClone: IConfigurationTree = JSON.parse(
    JSON.stringify(configurationTree)
  )

  const groups: IConfigurationTreeGroupFormatted[] = []
  const configList: IConfigList = {}
  const resources: IResources = {}
  for (const [groupCode, group] of getSortedConfigurationTreeGroupsByPosition(
    configurationTreeClone.groups
  )) {
    groups.push({
      code: groupCode,
      label: group.label,
      scopeType: group.scopeType,
    })
    const fieldsets: IGallyClass = { fieldset: {} }
    const fields: IField[] = []
    for (const [fieldsetCode, fieldset] of Object.entries(group.fieldsets)) {
      fieldsets.fieldset = {
        ...fieldsets.fieldset,
        [fieldsetCode]: {
          label: fieldset.label,
          position: fieldset.position,
          tooltip: fieldset.tooltip,
        },
      }
      for (const [fieldCode, baseField] of Object.entries(fieldset.fields)) {
        const field = { ...baseField, fieldset: fieldsetCode }
        ;(configList[groupCode] ??= []).push(fieldCode)
        fields.push(formatConfigurationField(field, fieldCode))
      }
    }
    resources[groupCode] ??= {
      label: '',
      supportedOperation: [],
      supportedProperty: fields,
      title: '',
      url: '',
      gally: fieldsets,
    } as IResource
  }

  return [resources, groups, configurationTreeClone.scopes, configList]
}
