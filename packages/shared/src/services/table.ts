import { TFunction } from 'i18next'

import { booleanRegexp } from '../constants'
import {
  DataContentType,
  IField,
  IFieldConfig,
  IHydraMapping,
  IHydraMember,
  IHydraResponse,
  IImage,
  IResource,
} from '../types'

import { getFieldLabelTranslationArgs, joinUrlPath } from './format'
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

const customValidations: Record<
  string,
  {
    attribute: string
    value: string | number
    error: {
      name: string
      message: string
    }
  }
> = {
  prompt: {
    attribute: 'pattern',
    value: '^(?:(?!%)[\\s\\S])*%s(?:(?!%)[\\s\\S])*$',
    error: {
      name: 'patternMismatch',
      message: 'prompt',
    },
  },
  email: {
    attribute: 'type',
    value: 'email',
    error: {
      name: 'typeMismatch',
      message: 'typeMismatchEmail',
    },
  },
}

export function getFieldConfig(
  field: IField
): Pick<
  IFieldConfig,
  | 'depends'
  | 'field'
  | 'suffix'
  | 'validation'
  | 'showError'
  | 'replacementErrorsMessages'
> {
  const validation: Record<string, string | number> = {}
  const replacementErrorsMessages: Record<string, string> = {}
  let showError = false
  Object.entries(field.gally?.validation || {}).forEach(([key, value]) => {
    if (customValidations[key] && value) {
      validation[customValidations[key].attribute] =
        customValidations[key].value
      replacementErrorsMessages[customValidations[key].error.name] =
        customValidations[key].error.message
      showError = true
    } else if (!customValidations[key] && typeof value !== 'boolean') {
      validation[key] = value
    }
  })
  return {
    depends: field.gally?.depends,
    field,
    suffix: field.gally?.input === 'percentage' ? '%' : '',
    validation,
    showError,
    replacementErrorsMessages,
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
    gridHeaderInfoTooltip: field.gally?.gridHeaderInfoTooltip,
    id,
    input,
    infoTooltip: field.gally?.infoTooltip,
    label:
      field.property.label ?? t(...getFieldLabelTranslationArgs(field.title)),
    name: id,
    required: field.gally?.required ?? field.required,
    type,
    multipleValueFormat: field.gally?.multipleValueFormat,
    requestTypeConfigurations: field.gally?.requestTypeConfigurations,
    multipleInputConfiguration: field.gally?.multipleInputConfiguration,
    placeholder: field.gally?.placeholder,
    defaultValue: field.gally?.defaultValue,
    sticky: field.gally?.sticky,
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
    input:
      input !== DataContentType.DATE &&
      mapping.variable.endsWith('[between]')
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

function isDateFilterOperatorMapping(mapping: IHydraMapping): boolean {
  return (
    mapping.variable.endsWith('[before]') ||
    mapping.variable.endsWith('[strictly_before]') ||
    mapping.variable.endsWith('[after]') ||
    mapping.variable.endsWith('[strictly_after]')
  )
}

function isOperatorMapping(mapping: IHydraMapping): boolean {
  return mapping.variable.endsWith('[lt]') ||
  mapping.variable.endsWith('[gt]') ||
  mapping.variable.endsWith('[lte]') ||
  mapping.variable.endsWith('[gte]')
}

function extractDateMappings(
  mappings: IHydraMapping[],
  resource: IResource
): IMapping[] {
  if (!mappings) {
    return []
  }
  // Date mappings do not have simple filters, they only exists as dateAttribute[before],
  // dateAttribute[strictly_before], dateAttribute[after], dateAttribute[strictly_after]
  // We must create a simple "dateAttribute" filter mapping when one of the above exists
  return Object.values(
    mappings.reduce((acc: Record<string, IMapping>, mapping) => {
      const baseVariable = mapping.variable.replace(
        /\[(before|strictly_before|after|strictly_after)\]$/,
        ''
      )
      const betweenVariable = `${baseVariable}[between]`
      if (isDateFilterOperatorMapping(mapping) && !acc[betweenVariable]) {
        acc[betweenVariable] = {
          ...mapping,
          variable: betweenVariable,
          field: getField(resource, mapping.property),
          multiple: mapping.variable.endsWith('[]'),
        }
      }

      return acc
    }, {})
  )
}

export function getMappings<T extends IHydraMember>(
  apiData: IHydraResponse<T>,
  resource: IResource
): IMapping[] {
  const dateMappings = extractDateMappings(
    apiData?.['hydra:search']['hydra:mapping'],
    resource
  )

  const mappings: IMapping[] = apiData?.['hydra:search']['hydra:mapping']
    .filter(
      (mapping) => !isOperatorMapping(mapping) && !isDateFilterOperatorMapping(mapping)
    )
    .map((mapping) => ({
      ...mapping,
      field: getField(resource, mapping.property),
      multiple: mapping.variable.endsWith('[]'),
    }))
    .filter((mapping) => mapping.field)
    .concat(dateMappings)
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

export function getImagePath(image: IImage | string): string {
  return typeof image === 'object' && 'path' in image
    ? image.path
    : (image as string)
}

export function isIImage(image: IImage | string): boolean {
  return typeof image === 'object' && 'path' in image && 'icons' in image
}

export function getImageValue(
  baseUrl: string,
  rowValue: string | IImage
): string | IImage {
  let image = rowValue
  if (typeof image !== 'string' && isIImage(rowValue)) {
    image = { ...image, path: joinUrlPath(baseUrl, image.path) }
  } else {
    image = joinUrlPath(baseUrl, getImagePath(image))
  }

  return image
}
