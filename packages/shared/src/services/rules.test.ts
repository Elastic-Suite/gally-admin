import ruleEngineOperators from '../mocks/static/rule_engine_operators.json'
import { attributeRule, combinationRule } from '../mocks'
import {
  IRuleAttribute,
  IRuleCombination,
  IRuleEngineOperators,
  RuleType,
} from '../types'

import {
  cleanBeforeSaveCatConf,
  isAttributeRule,
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
  })
})
