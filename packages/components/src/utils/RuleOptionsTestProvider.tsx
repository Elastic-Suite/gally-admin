import React, { ReactNode } from 'react'
import {
  IRuleEngineOperators,
  RuleAttributeType,
  getIri,
} from '@elastic-suite/gally-admin-shared'

import ruleEngineOperator from '../../public/mocks/rule_engine_operators.json'
import sourceFields from '../../public/mocks/source_fields.json'
import sourceFieldLabels from '../../public/mocks/source_field_labels.json'

import RuleOptionsProvider from '../components/stateful-providers/RuleOptionsProvider/RuleOptionsProvider'

interface IProps {
  children: ReactNode
}

const sourceFieldLabelsMap = new Map(
  sourceFieldLabels.member.map((label) => [
    label.sourceField,
    label.label,
  ])
)

const fields = sourceFields.member.map((field) => {
  const label = sourceFieldLabelsMap.get(getIri('source_fields', field.id))
  return {
    id: field.id,
    code: field.code,
    label: (label || field.defaultLabel) ?? '',
    type: field.type as RuleAttributeType,
  }
})

function RuleOptionsTestProvider(props: IProps): JSX.Element {
  const { children } = props
  return (
    <RuleOptionsProvider
      catalogId={-1}
      localizedCatalogId={-1}
      fields={fields}
      ruleOperators={ruleEngineOperator as IRuleEngineOperators}
    >
      {children}
    </RuleOptionsProvider>
  )
}

export default RuleOptionsTestProvider
