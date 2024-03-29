import { emptyCombinationRule, ruleValueNumberTypes } from '../constants'
import {
  ICategoryConfiguration,
  IOperatorsValueType,
  IParsedCategoryConfiguration,
  IRule,
  IRuleAttribute,
  IRuleCombination,
  IRuleEngineOperators,
  RuleType,
  RuleValueType,
} from '../types'

export function isCombinationRule(rule: IRule): rule is IRuleCombination {
  return rule.type === RuleType.COMBINATION
}

export function isAttributeRule(rule: IRule): rule is IRuleAttribute {
  return rule.type === RuleType.ATTRIBUTE
}

export function getAttributeRuleValueType(
  rule: IRuleAttribute,
  operatorsValueType: IOperatorsValueType
): RuleValueType {
  return operatorsValueType[rule.attribute_type]?.[rule.operator]
}

export function isAttributeRuleValueMultiple(
  valueType: RuleValueType
): boolean {
  return valueType?.startsWith('[') && valueType?.endsWith(']')
}

export function parseRule<R extends IRule>(rule: R): R {
  if (isCombinationRule(rule)) {
    return {
      ...rule,
      value: rule.value === 'true',
      children: rule.children.map((rule) => parseRule(rule)),
    }
  }
  return rule
}

export function parseCatConf(
  catConf: ICategoryConfiguration
): IParsedCategoryConfiguration {
  let virtualRule: IRuleCombination
  try {
    virtualRule = parseRule(JSON.parse(catConf.virtualRule))
  } catch {
    virtualRule = emptyCombinationRule
  }
  return { ...catConf, virtualRule }
}

export function serializeRule<R extends IRule>(
  rule: R,
  ruleOperators?: IRuleEngineOperators
): R {
  if (isCombinationRule(rule)) {
    return {
      ...rule,
      value: String(rule.value),
      children: rule.children.map((rule) => serializeRule(rule, ruleOperators)),
    }
  } else if (isAttributeRule(rule)) {
    let ruleValue: string | string[] | number | number[] | boolean = rule.value
    const valueType = getAttributeRuleValueType(
      rule,
      ruleOperators.operatorsValueType
    )
    if (
      isAttributeRuleValueMultiple(valueType) &&
      rule.value instanceof Array
    ) {
      if (
        ruleValueNumberTypes.includes(valueType.slice(1, -1) as RuleValueType)
      ) {
        ruleValue = rule.value.map(Number)
      } else {
        ruleValue = rule.value.map(String)
      }
    } else if (ruleValueNumberTypes.includes(valueType)) {
      ruleValue = Number(rule.value)
    } else if (valueType === RuleValueType.STRING) {
      ruleValue = String(rule.value)
    }
    return { ...rule, value: ruleValue }
  }
  return rule
}

export function serializeCatConf(
  catConf: IParsedCategoryConfiguration,
  ruleOperators?: IRuleEngineOperators
): ICategoryConfiguration {
  if (!catConf.virtualRule) {
    return catConf as Omit<IParsedCategoryConfiguration, 'virtualRule'>
  }
  return {
    ...catConf,
    virtualRule: JSON.stringify(
      serializeRule(catConf.virtualRule, ruleOperators)
    ),
  }
}

export function cleanBeforeSaveCatConf(
  catConf: ICategoryConfiguration | IParsedCategoryConfiguration
): ICategoryConfiguration | IParsedCategoryConfiguration {
  const catConfCleaned = { ...catConf }
  if (!catConf.id) {
    delete catConfCleaned['@id']
    delete catConfCleaned.id
  }

  return catConfCleaned
}

export function isRuleValid(rule?: IRule): boolean {
  if (!rule) {
    return true
  } else if (isCombinationRule(rule)) {
    return rule.children.every(isRuleValid)
  } else if (isAttributeRule(rule)) {
    return rule.field !== '' && rule.operator !== '' && rule.value !== ''
  }
  return true
}
