import { TFunction } from 'i18next'

import { booleanRegexp } from '../constants'
import {
  DataContentType,
  IField,
  IFieldConfig,
  IHydraMapping,
  IHydraMember,
  IHydraResponse,
  IResource,
} from '../types'

import { getFieldLabelTranslationArgs } from './format'
import { getField, getFieldType } from './hydra'

interface IMapping extends IHydraMapping {
  field: IField
  multiple: boolean
}

export function getFieldDataContentType(field: IField): DataContentType {
  const type = getFieldType(field)
  if (type === 'boolean') {
    return DataContentType.BOOLEAN
  } else if (type === 'integer' || type === 'float' || type === 'percentage') {
    return DataContentType.NUMBER
  }
  return DataContentType.STRING
}

const dataContentTypes = Object.values(DataContentType)
export function isDataContentType<T>(
  type: T | DataContentType
): type is DataContentType {
  return dataContentTypes.includes(type as DataContentType)
}

export function getFieldInput(
  field: IField,
  fallback: DataContentType
): DataContentType {
  if (field.gally?.input && isDataContentType(field.gally.input)) {
    return field.gally.input
  }
  return fallback
}

export function getFieldConfig(
  field: IField
): Pick<IFieldConfig, 'depends' | 'field' | 'suffix' | 'validation'> {
  return {
    depends: field.gally?.depends,
    field,
    suffix: field.gally?.input === 'percentage' ? '%' : '',
    validation: field.gally?.validation,
  }
}

export function getFieldHeader(field: IField, t: TFunction): IFieldConfig {
  const fieldConfig = getFieldConfig(field)
  const type = getFieldDataContentType(field)
  const id = field.title
  const input = getFieldInput(field, type)

  return {
    ...fieldConfig,
    editable: field.gally?.editable && field.writeable,
    fieldset: field.gally?.fieldset,
    id,
    input,
    infoTooltip: field.gally?.infoTooltip,
    label:
      field.property.label ?? t(...getFieldLabelTranslationArgs(field.title)),
    name: id,
    required: field.gally?.required ?? field.required,
    type,
    multipleSeparatorValue: field.gally?.multipleSeparatorValue,
    requestTypeConfigurations: field.gally?.requestTypeConfigurations,
    multipleInputConfiguration: field.gally?.multipleInputConfiguration,
  }
}

export function getFilterType(mapping: IMapping): DataContentType {
  return mapping.multiple
    ? DataContentType.SELECT
    : booleanRegexp.test(mapping.property)
    ? DataContentType.BOOLEAN
    : DataContentType.STRING
}

export function getFilter(mapping: IMapping, t: TFunction): IFieldConfig {
  const fieldConfig = getFieldConfig(mapping.field)
  const type = getFilterType(mapping)
  const id = mapping.variable
  const input = getFieldInput(mapping.field, type)
  return {
    ...fieldConfig,
    editable: true,
    id,
    input: mapping.variable.endsWith('[between]')
      ? DataContentType.RANGE
      : input,
    label: mapping.field
      ? mapping.field.property.label ??
        t(...getFieldLabelTranslationArgs(mapping.field.title))
      : t(...getFieldLabelTranslationArgs(mapping.property)),
    multiple: mapping.multiple,
    name: id,
    required: false, // Always false for filter
    type,
  }
}

export function getMappings<T extends IHydraMember>(
  apiData: IHydraResponse<T>,
  resource: IResource
): IMapping[] {
  const mappings: IMapping[] = apiData?.['hydra:search']['hydra:mapping']
    .filter(
      (mapping) =>
        !mapping.variable.endsWith('[lt]') &&
        !mapping.variable.endsWith('[gt]') &&
        !mapping.variable.endsWith('[lte]') &&
        !mapping.variable.endsWith('[gte]')
    )
    .map((mapping) => ({
      ...mapping,
      field: getField(resource, mapping.property),
      multiple: mapping.variable.endsWith('[]'),
    }))
    .filter((mapping) => mapping.field)
  const arrayProperties = mappings
    .filter((mapping) => mapping.multiple)
    .map((mapping) => mapping.property)

  return mappings
    ?.filter((mapping) => mapping.field.gally?.visible)
    .filter(
      (mapping) =>
        !arrayProperties.includes(mapping.property) || mapping.multiple
    )
    .sort((a, b) => a.field.gally?.position - b.field.gally?.position)
}
