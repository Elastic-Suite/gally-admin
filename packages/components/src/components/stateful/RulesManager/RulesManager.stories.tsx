import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import ruleEngineOperators from '../../../../public/mocks/rule_engine_operators.json'

import { complexRule } from '@elastic-suite/gally-admin-shared'

import RulesManager from './RulesManager'

export default {
  title: 'Stateful/RulesManager',
  component: RulesManager,
} as ComponentMeta<typeof RulesManager>

const Template: ComponentStory<typeof RulesManager> = (args) => {
  const { rule, ...props } = args
  const [ruleValue, setRuleValue] = useState(rule)
  return <RulesManager {...props} onChange={setRuleValue} rule={ruleValue} />
}

export const Default = Template.bind({})
Default.args = {
  localizedCatalogId: 1,
  first: true,
  rule: complexRule,
  ruleOperators: ruleEngineOperators,
}
