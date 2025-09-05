import {
  ConfigurationScopeType,
  IConfigurationTree,
  IConfigurationTreeGroupFormatted,
  IConfigurationTreeScopes,
} from '@elastic-suite/gally-admin-shared'
import { extractDataFromConfigurationTree } from './configuration'

const configurationTreeScopes: IConfigurationTreeScopes = {
  [ConfigurationScopeType.SCOPE_GENERAL]: {
    input: 'hidden',
    label: 'General',
    filterName: 'general',
    options: { api_rest: '', api_graphql: '', values: [] },
  },
  [ConfigurationScopeType.SCOPE_LOCALIZED_CATALOG]: {
    input: 'optgroup',
    filterName: 'localizedCatalogCode',
    options: {
      api_rest:
        '/configuration_localized_catalog_group_options?keyToGetOnValue=code',
      api_graphql: 'configurationLocalizedCatalogGroupOptions',
      values: [],
    },
    label: 'Catalogues localisés',
  },
  [ConfigurationScopeType.SCOPE_REQUEST_TYPE]: {
    input: 'select',
    filterName: 'requestType',
    options: {
      api_rest: '/configuration_request_type_options',
      api_graphql: 'configurationRequestTypeOptions',
      values: [],
    },
    label: 'Types de requête',
  },
  [ConfigurationScopeType.SCOPE_LOCALE]: {
    input: 'optgroup',
    filterName: 'localeCode',
    options: {
      api_rest: '/configuration_locale_group_options',
      api_graphql: 'configurationLocaleGroupOptions',
      values: [],
    },
    label: 'Locales',
  },
  [ConfigurationScopeType.SCOPE_LANGUAGE]: {
    input: 'optgroup',
    filterName: 'language',
    options: {
      api_rest: '/configuration_language_options',
      api_graphql: 'configurationLanguageOptions',
      values: [],
    },
    label: 'Langues',
  },
}

const testConfigurationTree: IConfigurationTree = {
  '@type': '',
  '@id': '',
  scopes: configurationTreeScopes,
  groups: {
    group1: {
      scopeType: ConfigurationScopeType.SCOPE_LOCALIZED_CATALOG,
      fieldsets: {
        fieldset1: {
          position: 1,
          fields: {
            string_field_1: {
              position: 2,
              input: 'string',
              visible: true,
              editable: true,
              required: true,
              label: 'A simple string field',
            },
            string_field_2: {
              position: 1,
              input: 'string',
              visible: true,
              editable: true,
              required: true,
              label: 'Another string field',
            },
          },
          label: 'Fieldset 1',
          tooltip: '',
        },
        fieldset2: {
          position: 2,
          fields: {
            select: {
              position: 5,
              input: 'select',
              options: {
                api_rest: '/select_api_options',
                api_graphql: 'selectApiOptions',
                values: [],
              },
              visible: true,
              editable: true,
              required: true,
              label: 'Select',
            },
          },
          label: 'Fieldset 2',
          tooltip: '',
        },
      },
      label: 'Group 1',
    },
    group2: {
      scopeType: ConfigurationScopeType.SCOPE_REQUEST_TYPE,
      fieldsets: {
        fieldset3: {
          position: 1,
          fields: {
            optgroup: {
              position: 2,
              input: 'optgroup',
              options: {
                api_rest: '/optgroup_options',
                api_graphql: 'optGroupOptions',
                values: [],
              },
              visible: true,
              editable: true,
              required: true,
              label: 'Multi select',
            },
            select_with_static_values: {
              position: 0,
              input: 'select',
              options: {
                values: [
                  {
                    value: 'value1',
                    label: 'Label 1',
                  },
                  {
                    value: 'value 2',
                    label: 'Label 2',
                  },
                ],
              },
              visible: true,
              editable: true,
              required: true,
              label: 'Select with static values',
            },
            boolean: {
              position: 1,
              input: 'boolean',
              visible: true,
              editable: true,
              required: true,
              label: 'Boolean',
            },
          },
          label: 'Fieldset 3',
          tooltip: '',
        },
      },
      label: 'Group 2',
    },
  },
}

const expectedResources: unknown = {
  group1: {
    label: '',
    supportedOperation: [],
    supportedProperty: [
      {
        '@type': '',
        description: 'A simple string field',
        property: {
          '@id': '#Configuration\\string_field_1',
          '@type': '',
          domain: {
            '@id': '',
          },
          label: 'A simple string field',
        },
        readable: true,
        required: true,
        title: 'string_field_1',
        writeable: true,
        gally: {
          position: 2,
          input: 'string',
          label: 'A simple string field',
          visible: true,
          editable: true,
          required: true,
          fieldset: 'fieldset1',
        },
      },
      {
        '@type': '',
        description: 'Another string field',
        property: {
          '@id': '#Configuration\\string_field_2',
          '@type': '',
          domain: {
            '@id': '',
          },
          label: 'Another string field',
        },
        readable: true,
        required: true,
        title: 'string_field_2',
        writeable: true,
        gally: {
          position: 1,
          input: 'string',
          label: 'Another string field',
          visible: true,
          editable: true,
          required: true,
          fieldset: 'fieldset1',
        },
      },
      {
        '@type': '',
        description: 'Select',
        property: {
          '@id': '#Configuration\\select',
          '@type': '',
          domain: {
            '@id': '',
          },
          label: 'Select',
        },
        readable: true,
        required: true,
        title: 'select',
        writeable: true,
        gally: {
          position: 5,
          input: 'select',
          label: 'Select',
          options: {
            api_rest: '/select_api_options',
            api_graphql: 'selectApiOptions',
            values: [],
          },
          visible: true,
          editable: true,
          required: true,
          fieldset: 'fieldset2',
        },
      },
    ],
    title: '',
    url: '',
    gally: {
      fieldset: {
        fieldset1: {
          label: 'Fieldset 1',
          position: 1,
          tooltip: '',
        },
        fieldset2: {
          label: 'Fieldset 2',
          position: 2,
          tooltip: '',
        },
      },
    },
  },
  group2: {
    label: '',
    supportedOperation: [],
    supportedProperty: [
      {
        '@type': '',
        description: 'Multi select',
        property: {
          '@id': '#Configuration\\optgroup',
          '@type': '',
          domain: {
            '@id': '',
          },
          label: 'Multi select',
        },
        readable: true,
        required: true,
        title: 'optgroup',
        writeable: true,
        gally: {
          position: 2,
          input: 'optgroup',
          label: 'Multi select',
          options: {
            api_rest: '/optgroup_options',
            api_graphql: 'optGroupOptions',
            values: [],
          },
          visible: true,
          editable: true,
          required: true,
          fieldset: 'fieldset3',
        },
      },
      {
        '@type': '',
        description: 'Select with static values',
        property: {
          '@id': '#Configuration\\select_with_static_values',
          '@type': '',
          domain: {
            '@id': '',
          },
          label: 'Select with static values',
        },
        readable: true,
        required: true,
        title: 'select_with_static_values',
        writeable: true,
        gally: {
          position: 0,
          input: 'select',
          label: 'Select with static values',
          options: {
            values: [
              {
                value: 'value1',
                label: 'Label 1',
              },
              {
                value: 'value 2',
                label: 'Label 2',
              },
            ],
          },
          visible: true,
          editable: true,
          required: true,
          fieldset: 'fieldset3',
        },
      },
      {
        '@type': '',
        description: 'Boolean',
        property: {
          '@id': '#Configuration\\boolean',
          '@type': '',
          domain: {
            '@id': '',
          },
          label: 'Boolean',
        },
        readable: true,
        required: true,
        title: 'boolean',
        writeable: true,
        gally: {
          position: 1,
          input: 'boolean',
          label: 'Boolean',
          visible: true,
          editable: true,
          required: true,
          fieldset: 'fieldset3',
        },
      },
    ],
    title: '',
    url: '',
    gally: {
      fieldset: {
        fieldset3: {
          label: 'Fieldset 3',
          position: 1,
          tooltip: '',
        },
      },
    },
  },
}

const expectedGroups: IConfigurationTreeGroupFormatted[] = [
  {
    code: 'group1',
    label: 'Group 1',
    scopeType: ConfigurationScopeType.SCOPE_LOCALIZED_CATALOG,
  },
  {
    code: 'group2',
    label: 'Group 2',
    scopeType: ConfigurationScopeType.SCOPE_REQUEST_TYPE,
  },
]

const expectedConfigurationTreeScopes: IConfigurationTreeScopes = {
  general: {
    input: 'hidden',
    label: 'General',
    filterName: 'general',
    options: {
      api_rest: '',
      api_graphql: '',
      values: [],
    },
  },
  localized_catalog: {
    input: 'optgroup',
    filterName: 'localizedCatalogCode',
    options: {
      api_rest:
        '/configuration_localized_catalog_group_options?keyToGetOnValue=code',
      api_graphql: 'configurationLocalizedCatalogGroupOptions',
      values: [],
    },
    label: 'Catalogues localisés',
  },
  request_type: {
    input: 'select',
    filterName: 'requestType',
    options: {
      api_rest: '/configuration_request_type_options',
      api_graphql: 'configurationRequestTypeOptions',
      values: [],
    },
    label: 'Types de requête',
  },
  locale: {
    input: 'optgroup',
    filterName: 'localeCode',
    options: {
      api_rest: '/configuration_locale_group_options',
      api_graphql: 'configurationLocaleGroupOptions',
      values: [],
    },
    label: 'Locales',
  },
  language: {
    input: 'optgroup',
    filterName: 'language',
    options: {
      api_rest: '/configuration_language_options',
      api_graphql: 'configurationLanguageOptions',
      values: [],
    },
    label: 'Langues',
  },
}

const expectedConfigList: unknown = {
  group1: ['string_field_1', 'string_field_2', 'select'],
  group2: ['optgroup', 'select_with_static_values', 'boolean'],
}

describe('Configuration Service', () => {
  it('Parses the configuration tree correctly', () => {
    const [
      configurationResource,
      configurationGroups,
      configurationScopes,
      configurationList,
    ] = extractDataFromConfigurationTree(testConfigurationTree)

    expect(configurationResource).toEqual(expectedResources)
    expect(configurationGroups).toEqual(expectedGroups)
    expect(configurationScopes).toEqual(expectedConfigurationTreeScopes)
    expect(configurationList).toEqual(expectedConfigList)
  })

  it('Sorts the configuration groups by position', () => {
    const clonedConfigurationTree = JSON.parse(
      JSON.stringify(testConfigurationTree)
    )
    clonedConfigurationTree.groups.group1.position = 2
    clonedConfigurationTree.groups.group2.position = 1
    const [, configurationGroups, , ,] = extractDataFromConfigurationTree(
      clonedConfigurationTree
    )
    const sortedConfigurationGroups = [
      {
        code: 'group2',
        label: 'Group 2',
        scopeType: ConfigurationScopeType.SCOPE_REQUEST_TYPE,
      },
      {
        code: 'group1',
        label: 'Group 1',
        scopeType: ConfigurationScopeType.SCOPE_LOCALIZED_CATALOG,
      },
    ]
    expect(configurationGroups).toEqual(sortedConfigurationGroups)
  })
})
