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
  getIri,
  getListApiParameters,
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
            const optionLabelFilters = {
              'order[position]': 'asc',
              sourceField: getIri('source_fields', field.id),
            }

            let currentPage = 0
            const limit = 200
            const promises = []
            let options: IOptions<string | number> = []

            const getOptionsData = async (
              page: number
            ): Promise<{
              totalItems: number
              options: IOptions<string | number>
            }> => {
              const optionsResponse = await fetchApi<
                IHydraResponse<ISourceFieldOption>
              >(
                sourceFieldOptionResource,
                getListApiParameters(page, limit, optionLabelFilters)
              )
              if (!isError(optionsResponse)) {
                const options = getOptionsFromOptionResource(
                  optionsResponse,
                  localizedCatalogId
                )
                const totalItems = optionsResponse['hydra:totalItems']
                return { totalItems, options }
              }
              throw new Error('error')
            }

            const { totalItems, options: newOptions } = await getOptionsData(
              currentPage
            )
            options = newOptions
            for (; totalItems > (currentPage + 1) * limit; currentPage++) {
              promises.push(getOptionsData(currentPage + 1))
            }
            const otherOptions = await Promise.all(promises)
            options = [
              ...options,
              ...otherOptions.map(({ options }) => options).flat(),
            ]
            return options
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
