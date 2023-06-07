import React, { useContext, useMemo } from 'react'

import { useApiList, useResource, useRuleOperators } from '../../../hooks'
import {
  IRuleCombination,
  IRuleEngineOperators,
  ISourceField,
  ISourceFieldLabel,
  RuleAttributeType,
  parseRule,
  serializeRule,
} from '@elastic-suite/gally-admin-shared'

import { catalogContext } from '../../../contexts'

import CombinationRules, {
  ICombinationRulesProps,
} from '../../atoms/rules/CombinationRules'
import RuleOptionsProvider from '../../stateful-providers/RuleOptionsProvider/RuleOptionsProvider'

const sourceFieldFixedFilters = {
  'metadata.entity': 'product',
  isUsedForRules: true,
}

interface IProps
  extends Omit<
    ICombinationRulesProps,
    'catalogId' | 'localizedCatalogId' | 'rule' | 'onChange'
  > {
  active?: boolean
  rule?: string | IRuleCombination
  onChange?: (value: string | IRuleCombination) => void
  ruleOperators?: IRuleEngineOperators
}

function RulesManager(props: IProps): JSX.Element {
  const { active, ruleOperators: ruleOperatorsDefault, ...ruleProps } = props
  const { catalogId, localizedCatalogId } = useContext(catalogContext)
  const ruleOperators = useRuleOperators(ruleOperatorsDefault)

  const rule: IRuleCombination =
    typeof ruleProps.rule === 'string'
      ? parseRule(JSON.parse(ruleProps.rule))
      : ruleProps.rule

  function handleChange(rule: IRuleCombination): void {
    if (typeof ruleProps.rule === 'string') {
      return ruleProps.onChange(
        JSON.stringify(serializeRule(rule, ruleOperators))
      )
    }
    ruleProps.onChange(rule)
  }

  // Source fields
  const sourceFieldResource = useResource('SourceField')
  const filters = useMemo(() => {
    if (ruleOperators?.operatorsValueType) {
      return {
        ...sourceFieldFixedFilters,
        'type[]': Object.keys(ruleOperators.operatorsValueType),
      }
    }
  }, [ruleOperators?.operatorsValueType])
  const [sourceFields] = useApiList<ISourceField>(
    sourceFieldResource,
    false,
    undefined,
    filters
  )

  // Source field labels
  const sourceFieldLabelResource = useResource('SourceFieldLabel')
  const sourceFieldLabelFilters = useMemo(() => {
    const filters: { localizedCatalog?: string } = {}
    if (localizedCatalogId !== -1) {
      filters.localizedCatalog = `/localized_catalogs/${localizedCatalogId}`
    }
    return filters
  }, [localizedCatalogId])
  const [sourceFieldLabels] = useApiList<ISourceFieldLabel>(
    sourceFieldLabelResource,
    false,
    undefined,
    sourceFieldLabelFilters
  )

  if (!sourceFields.data || !sourceFieldLabels.data || !ruleOperators) {
    return null
  }

  const sourceFieldLabelsMap = new Map(
    sourceFieldLabels.data['hydra:member'].map((label) => [
      label.sourceField,
      label.label,
    ])
  )

  const fields = sourceFields.data['hydra:member'].map((field) => {
    const label = sourceFieldLabelsMap.get(`/source_fields/${field.id}`)
    return {
      id: field.id,
      code: field.code,
      label: (label || field.defaultLabel) ?? '',
      type: field.type as RuleAttributeType,
    }
  })

  return (
    <RuleOptionsProvider
      catalogId={catalogId}
      localizedCatalogId={localizedCatalogId}
      fields={fields}
      ruleOperators={ruleOperators}
    >
      {Boolean(active) && (
        <CombinationRules
          catalogId={catalogId}
          localizedCatalogId={localizedCatalogId}
          {...ruleProps}
          rule={rule}
          onChange={handleChange}
        />
      )}
    </RuleOptionsProvider>
  )
}

RulesManager.defaultProps = {
  first: true,
}

export default RulesManager
