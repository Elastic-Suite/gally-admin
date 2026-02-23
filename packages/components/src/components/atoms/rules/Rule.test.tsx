import React from 'react'

import { renderWithProviders } from '../../../utils/tests'
import { ruleOptionsContext } from '../../../contexts'

import Rule from './Rule'
import {
  IOperatorsValueType,
  IRule,
  RuleType,
} from '@elastic-suite/gally-admin-shared'

interface IRuleOptionsContextValue {
  getAttributeOperatorOptions: jest.Mock
  getAttributeType: jest.Mock
  loadAttributeValueOptions: jest.Mock
  operatorsValueType: IOperatorsValueType
  options: Map<string, unknown>
}

const createMockRuleOptionsContext = (
  overrides: Partial<IRuleOptionsContextValue> = {}
): IRuleOptionsContextValue => {
  const defaultContext: IRuleOptionsContextValue = {
    getAttributeOperatorOptions: jest.fn(() => [
      { value: 'eq', label: 'is equal', id: 'eq' },
      { value: '!eq', label: 'is not equal', id: '!eq' },
      { value: 'match', label: 'contains', id: 'match' },
      { value: '!match', label: 'does not contain', id: '!match' },
      { value: 'in', label: 'is one of', id: 'in' },
      { value: '!in', label: 'is not one of', id: '!in' },
    ]),
    getAttributeType: jest.fn((fieldCode: string) => {
      const fieldTypeMap: Record<string, string> = {
        sku: 'reference',
        name: 'text',
        price: 'price',
        id: 'int',
      }
      return fieldTypeMap[fieldCode] || 'text'
    }),
    loadAttributeValueOptions: jest.fn(),
    operatorsValueType: {
      text: {
        eq: 'String',
        '!eq': 'String',
        match: 'String',
        '!match': 'String',
        in: '[String]',
        '!in': '[String]',
      },
      reference: {
        eq: 'String',
        '!eq': 'String',
        match: 'String',
        '!match': 'String',
        in: '[String]',
        '!in': '[String]',
      },
      keyword: {
        eq: 'String',
        '!eq': 'String',
        match: 'String',
        '!match': 'String',
        in: '[String]',
        '!in': '[String]',
      },
      int: {
        eq: 'Int',
        '!eq': 'Int',
        gt: 'Int',
        gte: 'Int',
        lt: 'Int',
        lte: 'Int',
        in: '[Int]',
        '!in': '[Int]',
      },
      float: {
        eq: 'Float',
        '!eq': 'Float',
        gt: 'Float',
        gte: 'Float',
        lt: 'Float',
        lte: 'Float',
        in: '[Float]',
        '!in': '[Float]',
      },
      boolean: { eq: 'Boolean' },
      select: {
        eq: 'String',
        '!eq': 'String',
        in: '[String]',
        '!in': '[String]',
      },
      category: { eq: 'String!', '!eq': 'String!' },
      price: {
        eq: 'Float',
        '!eq': 'Float',
        gt: 'Float',
        gte: 'Float',
        lt: 'Float',
        lte: 'Float',
        in: '[Float]',
        '!in': '[Float]',
      },
      stock: { eq: 'Boolean' },
      date: {
        eq: 'String',
        '!eq': 'String',
        gt: 'String',
        gte: 'String',
        lt: 'String',
        lte: 'String',
        in: '[String]',
        '!in': '[String]',
      },
    } as IOperatorsValueType,
    options: new Map([
      [
        'combination-operator',
        [
          { value: 'all', label: 'all' },
          { value: 'any', label: 'any' },
        ],
      ],
      [
        'type-Boolean',
        [
          { value: true, label: 'true' },
          { value: false, label: 'false' },
        ],
      ],
      [
        'attribute-field',
        [
          { value: 'id', label: 'Id' },
          { value: 'sku', label: 'Sku' },
          { value: 'category', label: 'Category' },
          { value: 'name', label: 'Product Name' },
          { value: 'price', label: 'Price' },
          { value: 'stock', label: 'Stock' },
          { value: 'accessory_brand', label: 'Marque' },
          { value: 'accessory_gemstone_addon', label: 'Gemstone Addon' },
          {
            value: 'accessory_recyclable_material',
            label: 'Recyclable Material',
          },
          { value: 'color', label: 'Color' },
          { value: 'cost', label: 'Cost' },
          { value: 'fashion_color', label: 'Couleur' },
          { value: 'fashion_material', label: 'Matière' },
          { value: 'fashion_size', label: 'Size' },
          { value: 'fashion_style', label: 'Style' },
          { value: 'has_video', label: 'Has Video' },
          { value: 'manufacturer', label: 'Manufacturer' },
          { value: 'has_options', label: 'Has_options' },
          { value: 'activity', label: 'Activity' },
          { value: 'category_gear', label: 'Category' },
          { value: 'climate', label: 'Climate' },
          { value: 'collar', label: 'Collar' },
          { value: 'eco_collection', label: 'Eco Collection' },
          { value: 'erin_recommends', label: 'Erin Recommends' },
          { value: 'es_is_discounted', label: 'Discounted' },
          { value: 'es_is_in_stock', label: 'In stock' },
          { value: 'features_bags', label: 'Features' },
          { value: 'format', label: 'Format' },
          { value: 'gender', label: 'Gender' },
          { value: 'material', label: 'Material' },
          { value: 'new', label: 'New' },
          { value: 'pattern', label: 'Pattern' },
          { value: 'performance_fabric', label: 'Performance Fabric' },
          { value: 'purpose', label: 'Purpose' },
          { value: 'sale', label: 'Sale' },
          { value: 'size', label: 'Size' },
          { value: 'sleeve', label: 'Sleeve' },
          { value: 'strap_bags', label: 'Strap/Handle' },
          { value: 'style_bags', label: 'Style' },
          { value: 'style_bottom', label: 'Style' },
          { value: 'style_general', label: 'Style' },
          { value: 'date_of_manufacture', label: 'Date_of_manufacture' },
        ],
      ],
    ]),
  }

  return { ...defaultContext, ...overrides }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const renderRuleWithContext = (
  rule: IRule,
  contextOverrides: Partial<IRuleOptionsContextValue> = {}
) => {
  const mockContext = createMockRuleOptionsContext(contextOverrides)
  return renderWithProviders(
    <ruleOptionsContext.Provider value={mockContext as any}>
      <Rule catalogId={1} localizedCatalogId={1} rule={rule} />
    </ruleOptionsContext.Provider>
  )
}

describe('Should match snapshot Rule', () => {
  it('multiple sku value (type: text, operator: in)', () => {
    const { container } = renderRuleWithContext({
      type: RuleType.ATTRIBUTE,
      field: 'sku',
      operator: 'in',
      attribute_type: 'reference',
      value: ['VP11', '     VP12', '12.3', '15,8', '74'],
    } as IRule)
    expect(container).toMatchSnapshot()
  })

  it('multiple sku value (type: text, operator: !in)', () => {
    const { container } = renderRuleWithContext({
      type: RuleType.ATTRIBUTE,
      field: 'sku',
      operator: '!in',
      attribute_type: 'reference',
      value: ['VP11', '     VP12', '12.3', '15,8', '74'],
    } as IRule)
    expect(container).toMatchSnapshot()
  })

  it('multiple id value (type: int, operator: in)', () => {
    const { container } = renderRuleWithContext({
      type: RuleType.ATTRIBUTE,
      field: 'id',
      operator: 'in',
      attribute_type: 'int',
      value: ['35', '48.00', '52,32', 'fake_float', '12.3test'],
    } as IRule)
    expect(container).toMatchSnapshot()
  })

  it('multiple id value (type: int, operator: !in)', () => {
    const { container } = renderRuleWithContext({
      type: RuleType.ATTRIBUTE,
      field: 'id',
      operator: '!in',
      attribute_type: 'int',
      value: ['35', '48.00', '52,32', 'fake_float', '12.3test'],
    } as IRule)
    expect(container).toMatchSnapshot()
  })

  it('multiple price value (type: price, operator: in)', () => {
    const { container } = renderRuleWithContext({
      type: RuleType.ATTRIBUTE,
      field: 'price',
      operator: 'in',
      attribute_type: 'price',
      value: ['48.00', '52,32', 'fake_float', '12.3test', '32'],
    } as IRule)
    expect(container).toMatchSnapshot()
  })

  it('multiple price value (type: price, operator: !in)', () => {
    const { container } = renderRuleWithContext({
      type: RuleType.ATTRIBUTE,
      field: 'price',
      operator: '!in',
      attribute_type: 'price',
      value: ['48.00', '52,32', 'fake_float', '12.3test', '32'],
    } as IRule)
    expect(container).toMatchSnapshot()
  })
})
