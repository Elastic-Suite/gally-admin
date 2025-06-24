import React, { useContext, useMemo } from 'react'

import { useApiList, useResource, useRuleOperators } from '../../../hooks'
import {
  IRuleCombination,
  IRuleEngineOperators,
  ISourceField,
  ISourceFieldLabel,
  RuleAttributeType,
  getIri,
  parseRule,
  serializeRule,
} from '@elastic-suite/gally-admin-shared'

import { catalogContext } from '../../../contexts'

import CombinationRules, {
  ICombinationRulesProps,
} from '../../atoms/rules/CombinationRules'
import RuleOptionsProvider from '../../stateful-providers/RuleOptionsProvider/RuleOptionsProvider'
import { FormHelperText, InputLabel } from '@mui/material'
import InfoTooltip from '../../atoms/form/InfoTooltip'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import { useTranslation } from 'next-i18next'
import { TestId, generateTestId } from '../../../utils/testIds'

const sourceFieldFixedFilters = {
  'metadata.entity': 'product',
  isUsedForRules: true,
}

interface IRulesManagerWrapperProps
  extends Omit<
    ICombinationRulesProps,
    'catalogId' | 'localizedCatalogId' | 'rule' | 'onChange'
  > {
  active?: boolean
  rule?: string | IRuleCombination
  onChange?: (value: string | IRuleCombination) => void
  ruleOperators?: IRuleEngineOperators
  placeholder?: string
  label?: string
  infoTooltip?: string
  required?: boolean
  error?: boolean
  helperText?: string
  helperIcon?: string
  small?: boolean
  showError?: boolean
  componentId?: string
}

function RulesManagerWrapper({
  ruleOperators: defaultRuleOperators,
  ...props
}: IRulesManagerWrapperProps): JSX.Element {
  const ruleOperators = useRuleOperators(defaultRuleOperators)

  if (!ruleOperators) {
    return null
  }

  return <RulesManager {...props} ruleOperators={ruleOperators} />
}

interface IRulesManagerProps extends IRulesManagerWrapperProps {
  ruleOperators: IRuleEngineOperators
}
function RulesManager(props: IRulesManagerProps): JSX.Element {
  const {
    active,
    ruleOperators,
    label,
    infoTooltip,
    required,
    error,
    helperText,
    helperIcon,
    first,
    small,
    componentId,
    ...ruleProps
  } = props
  const { t } = useTranslation('common')
  const { catalogId, localizedCatalogId } = useContext(catalogContext)
  const rowsPerPage = 200
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
  }, [ruleOperators.operatorsValueType])
  const [sourceFields] = useApiList<ISourceField>(
    sourceFieldResource,
    false,
    rowsPerPage,
    filters,
    undefined,
    false,
    true
  )

  // Source field labels
  const sourceFieldLabelResource = useResource('SourceFieldLabel')
  const sourceFieldLabelFilters = useMemo(() => {
    const filters: { localizedCatalog?: string } = {}
    console.log()
    if (localizedCatalogId !== -1) {
      filters.localizedCatalog = getIri(
        'localized_catalogs',
        localizedCatalogId
      )
    }
    return filters
  }, [localizedCatalogId])
  const [sourceFieldLabels] = useApiList<ISourceFieldLabel>(
    sourceFieldLabelResource,
    false,
    rowsPerPage,
    sourceFieldLabelFilters,
    undefined,
    false,
    true
  )

  if (!sourceFields.data || !sourceFieldLabels.data) {
    return null
  }

  const sourceFieldLabelsMap = new Map(
    sourceFieldLabels.data['hydra:member'].map((label) => [
      label.sourceField,
      label.label,
    ])
  )

  const fields = sourceFields.data['hydra:member'].map((field) => {
    const label = sourceFieldLabelsMap.get(getIri('source_fields', field.id))
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
      {Boolean(label || infoTooltip) && (
        <InputLabel sx={{ marginBottom: '-20px' }} shrink required={required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      {Boolean(active) && (
        <CombinationRules
          catalogId={catalogId}
          localizedCatalogId={localizedCatalogId}
          {...ruleProps}
          first={first}
          rule={rule}
          onChange={handleChange}
          small={small}
        />
      )}
      {Boolean(helperText) && (
        <FormHelperText
          error={error}
          sx={{ marginTop: !first ? '-12px' : '8px' }}
          data-testid={generateTestId(TestId.HELPER_TEXT, componentId)}
        >
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {t(helperText)}
        </FormHelperText>
      )}
    </RuleOptionsProvider>
  )
}

RulesManager.defaultProps = {
  first: true,
  small: false,
}

export default RulesManagerWrapper
