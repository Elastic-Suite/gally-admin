import ruleEngineOperators from '../mocks/static/rule_engine_operators.json'
import { attributeRule, combinationRule } from '../mocks'
import {
  IRuleAttribute,
  IRuleCombination,
  IRuleEngineOperators,
  RuleAttributeType,
  RuleType,
  RuleValueType,
} from '../types'

import {
  cleanBeforeSaveCatConf,
  getAttributeRuleEmptyValue,
  getAttributeRuleRequiredValueType,
  isAttributeRule,
  isAttributeRuleValueOptional,
  isCombinationRule,
  isRuleValid,
  parseCatConf,
  serializeCatConf,
  serializeRule,
} from './rules'

describe('Rules service', () => {
  const virtualRule = `{
    "type":"combination",
    "operator":"all",
    "value":"true",
    "children": [
      {"type":"attribute","field":"sku","operator":"in","attribute_type":"reference","value":["42","45"]},
      {"type":"attribute","field":"size","operator":"in","attribute_type":"int","value":[42,45]},
      {"type":"attribute","field":"stock","operator":"eq","attribute_type":"stock","value":true},
      {"type":"attribute","field":"brand","operator":"eq","attribute_type":"text","value":"gally"},
      {"type":"attribute","field":"id","operator":"eq","attribute_type":"int","value":42}
    ]
  }`
    .replaceAll(' ', '')
    .replaceAll('\n', '')

  const catConf = {
    '@context': '/contexts/CategoryConfiguration',
    '@id': '/category_configurations/6',
    '@type': 'CategoryConfiguration',
    category: '/categories/one',
    defaultSorting: 'category__position',
    id: 6,
    isActive: true,
    isVirtual: true,
    name: 'Catégorie Une',
    useNameInProductSearch: false,
    virtualRule: '',
  }

  const parsedVirtualRule = {
    type: 'combination',
    operator: 'all',
    value: true,
    children: [
      {
        type: 'attribute',
        field: 'sku',
        operator: 'in',
        attribute_type: 'reference',
        value: ['42', '45'],
      },
      {
        type: 'attribute',
        field: 'size',
        operator: 'in',
        attribute_type: 'int',
        value: [42, 45],
      },
      {
        type: 'attribute',
        field: 'stock',
        operator: 'eq',
        attribute_type: 'stock',
        value: true,
      },
      {
        type: 'attribute',
        field: 'brand',
        operator: 'eq',
        attribute_type: 'text',
        value: 'gally',
      },
      {
        type: 'attribute',
        field: 'id',
        operator: 'eq',
        attribute_type: 'int',
        value: 42,
      },
    ] as IRuleAttribute[],
  } as IRuleCombination

  const dateVirtualRule = {
    type: RuleType.COMBINATION,
    operator: 'all',
    value: true,
    children: [
      {
        type: RuleType.ATTRIBUTE,
        field: 'created_at',
        operator: 'eq',
        attribute_type: RuleAttributeType.DATE,
        value: '',
      },
    ] as IRuleAttribute[],
  } as IRuleCombination

  describe('isAttributeRule', () => {
    it('should check if rule is an attribute rule', () => {
      expect(isAttributeRule(attributeRule)).toEqual(true)
      expect(isAttributeRule(combinationRule)).toEqual(false)
    })
  })

  describe('isCombinationRule', () => {
    it('should check if rule is a combination rule', () => {
      expect(isCombinationRule(attributeRule)).toEqual(false)
      expect(isCombinationRule(combinationRule)).toEqual(true)
    })
  })

  describe('parseCatConf', () => {
    it('should return a new empty rule', () => {
      expect(parseCatConf(catConf)).toEqual(
        expect.objectContaining({
          virtualRule: {
            type: 'combination',
            operator: 'all',
            value: true,
            children: [],
          },
        })
      )
    })

    it('should parse the category configuration', () => {
      expect(parseCatConf({ ...catConf, virtualRule })).toEqual(
        expect.objectContaining({
          virtualRule: parsedVirtualRule,
        })
      )
    })
  })

  describe('serializeRule', () => {
    it('should serialize the rule', () => {
      expect(
        serializeRule(
          parsedVirtualRule,
          ruleEngineOperators as IRuleEngineOperators
        )
      ).toEqual({
        type: 'combination',
        operator: 'all',
        value: 'true',
        children: [
          {
            type: 'attribute',
            field: 'sku',
            operator: 'in',
            attribute_type: 'reference',
            value: ['42', '45'],
          },
          {
            type: 'attribute',
            field: 'size',
            operator: 'in',
            attribute_type: 'int',
            value: [42, 45],
          },
          {
            type: 'attribute',
            field: 'stock',
            operator: 'eq',
            attribute_type: 'stock',
            value: true,
          },
          {
            type: 'attribute',
            field: 'brand',
            operator: 'eq',
            attribute_type: 'text',
            value: 'gally',
          },
          {
            type: 'attribute',
            field: 'id',
            operator: 'eq',
            attribute_type: 'int',
            value: 42,
          },
        ],
      })
    })

    it('should serialize the rules without value or with an optional value', () => {
      const operators = ruleEngineOperators as IRuleEngineOperators
      const contextOperators = {
        ...operators,
        operatorsValueType: {
          ...operators.operatorsValueType,
          category: {
            ...operators.operatorsValueType.category,
            same_as: null,
          },
          price: {
            ...operators.operatorsValueType.price,
            higher_than: RuleValueType.FLOAT_OPTIONAL,
          },
        },
      } as IRuleEngineOperators
      const getRule = (
        field: string,
        operator: string,
        attributeType: RuleAttributeType,
        value: IRuleAttribute['value']
      ): IRuleAttribute => ({
        type: RuleType.ATTRIBUTE,
        field,
        operator,
        attribute_type: attributeType,
        value,
      })

      expect(
        serializeRule(
          getRule('category', 'same_as', RuleAttributeType.CATEGORY, ''),
          contextOperators
        ).value
      ).toBeNull()
      expect(
        serializeRule(
          getRule('price', 'higher_than', 'price' as RuleAttributeType, ''),
          contextOperators
        ).value
      ).toBeNull()
      expect(
        serializeRule(
          getRule('price', 'higher_than', 'price' as RuleAttributeType, '20.5'),
          contextOperators
        ).value
      ).toEqual(20.5)
    })
  })

  describe('rule value types', () => {
    it('should handle the optional value types', () => {
      expect(
        isAttributeRuleValueOptional(RuleValueType.FLOAT_OPTIONAL)
      ).toEqual(true)
      expect(isAttributeRuleValueOptional(RuleValueType.FLOAT)).toEqual(false)
      expect(isAttributeRuleValueOptional(null)).toEqual(false)
      expect(
        getAttributeRuleRequiredValueType(RuleValueType.FLOAT_OPTIONAL)
      ).toEqual(RuleValueType.FLOAT)
      expect(getAttributeRuleRequiredValueType(RuleValueType.INT)).toEqual(
        RuleValueType.INT
      )
    })

    it('should get the empty value of a rule', () => {
      expect(getAttributeRuleEmptyValue(null)).toBeNull()
      expect(
        getAttributeRuleEmptyValue(RuleValueType.FLOAT_OPTIONAL)
      ).toBeNull()
      expect(getAttributeRuleEmptyValue(RuleValueType.INT_MULTIPLE)).toEqual([])
      expect(getAttributeRuleEmptyValue(RuleValueType.STRING)).toEqual('')
      expect(getAttributeRuleEmptyValue(undefined)).toEqual('')
    })
  })

  describe('serializeCatConf', () => {
    it('should serialize the category configuration', () => {
      expect(
        serializeCatConf(
          { ...catConf, virtualRule: parsedVirtualRule },
          ruleEngineOperators as IRuleEngineOperators
        )
      ).toEqual(
        expect.objectContaining({
          virtualRule,
        })
      )
    })
  })

  describe('cleanBeforeSaveCatConf', () => {
    it('should remove useless data on category configuration before save', () => {
      const newCatConf = {
        ...catConf,
        id: 0,
        '@id': '/category_configurations/0',
      }
      expect(cleanBeforeSaveCatConf(newCatConf)).toEqual(
        expect.not.objectContaining({
          '@id': '/category_configurations/0',
        })
      )
    })
  })

  describe('isRuleValid', () => {
    it('should validate a rule', () => {
      expect(isRuleValid(parsedVirtualRule)).toEqual(true)
      expect(
        isRuleValid({
          type: RuleType.COMBINATION,
          operator: 'all',
          value: true,
          children: [
            {
              type: RuleType.ATTRIBUTE,
              field: 'sku',
              operator: 'in',
              attribute_type: 'reference',
              value: '',
            },
          ] as IRuleAttribute[],
        } as IRuleCombination)
      ).toEqual(false)
    })

    it('should validate a rule without value', () => {
      expect(
        isRuleValid({
          type: RuleType.ATTRIBUTE,
          field: 'category',
          operator: 'same_as',
          attribute_type: RuleAttributeType.CATEGORY,
          value: null,
        } as IRuleAttribute)
      ).toEqual(true)
    })

    it('should validate a rule with a date field as string', () => {
      const validDateRule = { ...dateVirtualRule }
      validDateRule.children[0].value = '2026-12-07'
      expect(isRuleValid(validDateRule)).toEqual(true)
    })

    it('should validate a rule with a date field as Date', () => {
      const validDateRule = { ...dateVirtualRule }
      validDateRule.children[0].value = new Date('2026-12-07')
      expect(isRuleValid(validDateRule)).toEqual(true)
    })

    it('should invalidate a rule with invalid date field as string', () => {
      const invalidDateRule = { ...dateVirtualRule }
      invalidDateRule.children[0].value = 'invalid date'
      expect(isRuleValid(invalidDateRule)).toEqual(false)
    })

    it('should invalidate a rule with invalid date field as Date', () => {
      const invalidDateRule = { ...dateVirtualRule }
      invalidDateRule.children[0].value = new Date('9999-99-99')
      expect(isRuleValid(invalidDateRule)).toEqual(false)
    })

    it('should invalidate a rule with empty date field', () => {
      const emptyDateRule = { ...dateVirtualRule }
      emptyDateRule.children[0].value = ''
      expect(isRuleValid(emptyDateRule)).toEqual(false)
    })
  })
})
