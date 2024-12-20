import React, { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { ruleOptionsContext } from '../../../contexts'
import { useResource, useSingletonLoader } from '../../../hooks'
import {
  ICategories,
  IFetchApi,
  IHydraResponse,
  IOptions,
  IRuleEngineOperators,
  ISourceFieldOption,
  ITreeItem,
  RuleAttributeType,
  RuleCombinationOperator,
  RuleType,
  RuleValueType,
  fetchApiUsingPagination,
  getIri,
  getOptionsFromEnum,
  getOptionsFromOptionResource,
  isError,
} from '@elastic-suite/gally-admin-shared'

export interface IField {
  id: number | string
  code: string
  label: string
  type: RuleAttributeType
}

interface IProps {
  catalogId: number
  children: ReactNode
  fields: IField[]
  localizedCatalogId: number
  ruleOperators: IRuleEngineOperators
}

function RuleOptionsProvider(props: IProps): JSX.Element {
  const { catalogId, children, fields, localizedCatalogId, ruleOperators } =
    props
  const { operators, operatorsBySourceFieldType, operatorsValueType } =
    ruleOperators
  const sourceFieldOptionResource = useResource('SourceFieldOption')
  const { t } = useTranslation('rules')
  const { fetch, map, setMap } = useSingletonLoader<
    IOptions<unknown> | ITreeItem[]
  >()

  // Add boolean options (we have to use useEffect for translation)
  useEffect(() => {
    setMap((options) => {
      const clone = new Map(options)
      clone.set(
        `${RuleType.COMBINATION}-operator`,
        getOptionsFromEnum(RuleCombinationOperator, t)
      )
      clone.set(`type-${RuleValueType.BOOLEAN}`, [
        { value: true, label: t('true') },
        { value: false, label: t('false') },
      ])
      return clone
    })
  }, [setMap, t])

  // Add list of fields
  useEffect(() => {
    setMap((options) =>
      new Map(options).set(
        `${RuleType.ATTRIBUTE}-field`,
        fields.map((field) => ({
          value: field.code,
          label: field.label,
        }))
      )
    )
  }, [fields, setMap])

  const attributeOperatorOptions = useMemo(
    () =>
      Object.entries(operators).map(([operator, label]) => ({
        value: operator,
        label: t(`operator.${label}`),
        id: operator,
      })),
    [operators, t]
  )

  const getAttributeOperatorOptions = useCallback(
    (fieldCode: string) => {
      const field = fields.find(({ code }) => code === fieldCode)
      if (!field) {
        return []
      }
      const operators = operatorsBySourceFieldType[field.type]
      if (!operators) {
        return []
      }
      return attributeOperatorOptions.filter((option) =>
        operators.includes(option.value)
      )
    },
    [attributeOperatorOptions, fields, operatorsBySourceFieldType]
  )

  const getAttributeType = useCallback(
    (fieldCode: string) => {
      const field = fields.find(({ code }) => code === fieldCode)
      if (field) {
        return field.type
      }
    },
    [fields]
  )

  const loadAttributeValueOptions = useCallback(
    (fieldCode: string): void => {
      const field = fields.find(({ code }) => code === fieldCode)
      if (!field) {
        return
      }
      if (field.type === RuleAttributeType.CATEGORY) {
        // Fetch categories for current catalog/localizedCatalog
        return fetch(
          `type-${RuleAttributeType.CATEGORY}-${catalogId}-${localizedCatalogId}`,
          async (fetchApi: IFetchApi) => {
            const filters: { catalogId?: number; localizedCatalogId?: number } =
              {}
            if (catalogId !== -1) {
              filters.catalogId = catalogId
            }
            if (localizedCatalogId !== -1) {
              filters.localizedCatalogId = localizedCatalogId
            }
            const response = await fetchApi<ICategories>(
              'categoryTree',
              filters
            )
            if (!isError(response)) {
              return response.categories
            }
            throw new Error('error')
          }
        )
      }
      if (field.type === RuleAttributeType.SELECT) {
        return fetch(
          `${field.code}-${localizedCatalogId}`,
          async (fetchApi: IFetchApi) => {
            const response = await fetchApiUsingPagination<
              IHydraResponse<ISourceFieldOption>
            >(
              fetchApi,
              sourceFieldOptionResource,
              {
                'order[position]': 'asc',
                sourceField: getIri('source_fields', field.id),
              },
              undefined,
              200
            )

            if (response.error) {
              throw new Error('soure_field_option request error')
            } else {
              return getOptionsFromOptionResource(
                response.data,
                localizedCatalogId
              )
            }
          }
        )
      }
    },
    [catalogId, fetch, fields, localizedCatalogId, sourceFieldOptionResource]
  )

  const context = useMemo(() => {
    return {
      getAttributeOperatorOptions,
      getAttributeType,
      loadAttributeValueOptions,
      operatorsValueType,
      options: map,
    }
  }, [
    getAttributeOperatorOptions,
    getAttributeType,
    loadAttributeValueOptions,
    map,
    operatorsValueType,
  ])

  return (
    <ruleOptionsContext.Provider value={context}>
      {children}
    </ruleOptionsContext.Provider>
  )
}

export default RuleOptionsProvider
