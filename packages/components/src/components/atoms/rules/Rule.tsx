import React, { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import {
  IOptions,
  IRule,
  IRuleAttribute,
  ITreeItem,
  RuleAttributeType,
  RuleType,
  RuleValueType,
  flatTree,
  getAttributeRuleValueType,
  isAttributeRule,
  isAttributeRuleValueMultiple,
  isCombinationRule,
  ruleArrayValueSeparator,
  ruleValueNumberTypes,
} from '@elastic-suite/gally-admin-shared'

import { ruleOptionsContext } from '../../../contexts'

import IonIcon from '../IonIcon/IonIcon'
import { Close, CustomCombination, Root } from './Rule.styled'
import DropDownError from '../form/DropDownError'
import TreeSelectorError from '../form/TreeSelectorError'
import InputTextError from '../form/InputTextError'

function getInputType(valueType: RuleValueType): 'number' | 'text' {
  if (ruleValueNumberTypes.includes(valueType)) {
    return 'number'
  }
  return 'text'
}

interface IProps {
  catalogId: number
  localizedCatalogId: number
  onChange?: (rule: IRule) => void
  onDelete?: () => void
  rule: IRule
  small?: boolean
  showError?: boolean
}

function Rule(props: IProps): JSX.Element {
  const {
    catalogId,
    showError,
    localizedCatalogId,
    onChange,
    onDelete,
    rule,
    small,
  } = props
  const {
    getAttributeOperatorOptions,
    getAttributeType,
    loadAttributeValueOptions,
    operatorsValueType,
    options,
  } = useContext(ruleOptionsContext)
  const { t } = useTranslation('rules')

  useEffect(() => {
    if (isAttributeRule(rule)) {
      loadAttributeValueOptions(rule.field)
    }
  }, [loadAttributeValueOptions, rule])

  const categories = useMemo(
    () =>
      (options.get(
        `type-${RuleAttributeType.CATEGORY}-${catalogId}-${localizedCatalogId}`
      ) ?? []) as ITreeItem[],
    [catalogId, localizedCatalogId, options]
  )
  const flatCategories: ITreeItem[] = useMemo(() => {
    const flat: ITreeItem[] = []
    flatTree(categories, flat)
    return flat
  }, [categories])

  function handleChange(property: string) {
    return (value: unknown): void => onChange({ ...rule, [property]: value })
  }

  function handleCategoryChange(value: ITreeItem | ITreeItem[]): void {
    if (value instanceof Array) {
      onChange({
        ...rule,
        value: value.map((category) => category.id as string),
      })
    } else {
      onChange({ ...rule, value: value.id })
    }
  }

  function handleInputChange(multiple: boolean) {
    return (value: string): void => {
      if (multiple) {
        onChange({ ...rule, value: value.split(ruleArrayValueSeparator) })
      } else {
        onChange({ ...rule, value })
      }
    }
  }

  function handleFieldChange(value: string): void {
    onChange({
      ...rule,
      attribute_type: getAttributeType(value) ?? '',
      field: value ?? '',
      value: [],
    } as IRuleAttribute)
  }

  function handleOperatorChange(operator: string): void {
    const attributeRule = rule as IRuleAttribute
    const newRule: IRuleAttribute = {
      ...attributeRule,
      operator,
    }
    const prevType = getAttributeRuleValueType(
      attributeRule,
      operatorsValueType
    )
    const newType = getAttributeRuleValueType(newRule, operatorsValueType)
    onChange({
      ...newRule,
      value:
        prevType === newType
          ? rule.value
          : isAttributeRuleValueMultiple(newType)
          ? []
          : '',
    })
  }

  function getAttributeValueComponent(rule: IRuleAttribute): JSX.Element {
    const { attribute_type, field, value } = rule
    const valueType = getAttributeRuleValueType(rule, operatorsValueType)
    const multiple = isAttributeRuleValueMultiple(valueType)

    if (valueType === RuleValueType.BOOLEAN) {
      return (
        <DropDownError
          showError={showError}
          onChange={handleChange('value')}
          options={
            (options.get(`type-${RuleValueType.BOOLEAN}`) ??
              []) as IOptions<boolean>
          }
          required
          small={small}
          value={value}
        />
      )
    } else if (attribute_type === RuleAttributeType.SELECT) {
      return (
        <DropDownError
          showError={showError}
          multiple={multiple}
          onChange={handleChange('value')}
          options={
            (options.get(`${field}-${localizedCatalogId}`) ??
              []) as IOptions<unknown>
          }
          required
          small={small}
          value={value}
        />
      )
    } else if (attribute_type === RuleAttributeType.CATEGORY) {
      const treeSelectorValue =
        value instanceof Array
          ? flatCategories.filter((category) =>
              (value as string[]).includes(category.id as string)
            )
          : flatCategories.find((category) => value === category.id) ?? null
      return (
        <TreeSelectorError
          showError={showError}
          data={categories}
          multiple={multiple}
          onChange={handleCategoryChange}
          required
          small={small}
          value={treeSelectorValue}
        />
      )
    }

    return (
      <InputTextError
        showError={showError}
        onChange={handleInputChange(multiple)}
        required
        small={small}
        type={getInputType(valueType)}
        value={
          multiple
            ? (value as string[]).join(ruleArrayValueSeparator)
            : (value as string)
        }
      />
    )
  }

  let content
  if (isCombinationRule(rule)) {
    const { operator, value } = rule
    content = (
      <>
        <DropDownError
          showError={showError}
          onChange={handleChange('operator')}
          options={
            (options.get(`${RuleType.COMBINATION}-operator`) ??
              []) as IOptions<string>
          }
          required
          small={small}
          value={operator}
        />
        <CustomCombination>{t('conditionsAre')}</CustomCombination>
        <DropDownError
          showError={showError}
          onChange={handleChange('value')}
          options={
            (options.get(`type-${RuleValueType.BOOLEAN}`) ??
              []) as IOptions<boolean>
          }
          required
          small={small}
          value={value}
        />
      </>
    )
  } else if (isAttributeRule(rule)) {
    const { field, operator } = rule
    content = (
      <>
        <DropDownError
          showError={showError}
          onChange={handleFieldChange}
          options={
            (options.get(`${RuleType.ATTRIBUTE}-field`) ??
              []) as IOptions<string>
          }
          required
          value={field}
          small={small}
        />
        <DropDownError
          showError={showError}
          onChange={handleOperatorChange}
          options={getAttributeOperatorOptions(field)}
          required
          small={small}
          transparent
          value={operator}
        />
        {getAttributeValueComponent(rule)}
      </>
    )
  }

  return (
    <Root>
      {content}
      <Close onClick={onDelete}>
        <IonIcon name="close" style={{ fontSize: '17.85px' }} />
      </Close>
    </Root>
  )
}

export default Rule
