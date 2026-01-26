import {
  IApi,
  IApiSchemaOptions,
  IField,
  IHydraError,
  IHydraLabelMember,
  IHydraMember,
  IHydraResponse,
  IJsonldType,
  IOptions,
  IResource,
  ISearchParameters,
  ISourceFieldOption,
  ISourceFieldOptionLabel,
} from '../types'

export class HydraError extends Error {
  error: IHydraError
  constructor(error: IHydraError) {
    super(error.description)
    this.error = error
  }
}

export function isJSonldType<T extends object>(
  json: T | IJsonldType
): json is IJsonldType {
  return '@type' in json
}

export function isHydraError<T extends IJsonldType>(
  json: T | IHydraError
): json is IHydraError {
  return json['@type'] === 'Error'
}

export function getResource(api: IApi, resourceName: string): IResource {
  return api.find(
    (resource) =>
      resource.title === resourceName || resource.label === resourceName
  )
}

export function getFieldName(property: string): string {
  if (property.endsWith('[]')) {
    return property.slice(0, -2)
  }
  if (property.endsWith('[between]')) {
    return property.slice(0, -9)
  }
  return property
}

export function getField(resource: IResource, name: string): IField {
  name = getFieldName(name)
  return resource.supportedProperty.find((field) => {
    return field.title === name || field?.gally?.alias === name
  })
}

export function getFieldType(field: IField): string {
  switch (field.property?.range?.['@id']) {
    case 'http://www.w3.org/2001/XMLSchema#array':
      return 'array'
    case 'http://www.w3.org/2001/XMLSchema#integer':
      return 'integer'
    case 'http://www.w3.org/2001/XMLSchema#decimal':
    case 'http://www.w3.org/2001/XMLSchema#float':
      return 'float'
    case 'http://www.w3.org/2001/XMLSchema#boolean':
      return 'boolean'
    case 'http://www.w3.org/2001/XMLSchema#date':
      return 'date'
    case 'http://www.w3.org/2001/XMLSchema#dateTime':
      return 'dateTime'
    default:
      return 'text'
  }
}

export function isReferenceField(field: IField): boolean {
  return field.property['@type'] === 'http://www.w3.org/ns/hydra/core#Link'
}

export function getReferencedResource(api: IApi, field: IField): IResource {
  return api.find((resource) => resource['@id'] === field.property.range['@id'])
}

export function getOptionsFromResource<T extends IHydraMember>(
  response: IHydraResponse<T>
): IOptions<string | number> {
  return response.member.map((member) => ({
    id: member.id,
    label: member['@id'],
    value: member.id,
  }))
}

export function getOptionsFromLabelResource<T extends IHydraLabelMember>(
  response: IHydraResponse<T>
): IOptions<string | number> {
  return response.member.map((member) => ({
    id: member.id,
    label: member.label,
    value: member.id,
  }))
}

export function getOptionsFromOptionResource(
  optionLabelsResponse: IHydraResponse<ISourceFieldOption>,
  localizedCatalogId = -1
): IOptions<string | number> {
  return optionLabelsResponse.member.map((option) => {
    let label = option.defaultLabel
    if (localizedCatalogId !== -1) {
      label =
        option.labels.find(
          (label) => label.localizedCatalog.id === localizedCatalogId
        )?.label ?? label
    }
    return {
      id: option.code,
      label,
      value: option.code,
    }
  })
}

export function getOptionsFromOptionLabelResource(
  optionLabelsResponse: IHydraResponse<ISourceFieldOptionLabel>
): IOptions<string | number> {
  return optionLabelsResponse.member.map((option) => ({
    id: option.sourceFieldOption.code,
    label: option.label,
    value: option.sourceFieldOption.code,
  }))
}

function convertValueForOpt(data: IApiSchemaOptions[]): IOptions<string> {
  return data.flatMap(({ label, options }) =>
    options.map((option) => ({
      id: label,
      value: option.value,
      label: option.label,
    }))
  )
}

export function getOptionsFromApiSchema(
  response: IHydraResponse<IApiSchemaOptions>
): IOptions<string | number> {
  const res = response.member.map(({ label, value, code, options }) => ({
    label,
    value: value ?? code,
    options,
  }))
  return res.some(({ options }) => options) ? convertValueForOpt(res) : res
}

export function castFieldParameter(
  field: IField,
  value: string | string[]
): string | number | boolean | (string | number | boolean)[] {
  if (value instanceof Array) {
    return value.map(
      (value) => castFieldParameter(field, value) as string | number | boolean
    )
  }
  if (isReferenceField(field)) {
    return Number(value)
  }
  switch (getFieldType(field)) {
    case 'integer':
      return value ? Number(value) : value
    case 'boolean':
      return value !== 'true' && value !== 'false' ? null : value === 'true'
    default:
      return value
  }
}

export function isFieldValueValid(field: IField, value: unknown): boolean {
  if (value instanceof Array) {
    return value.every((value) => isFieldValueValid(field, value))
  }
  if (isReferenceField(field)) {
    return typeof value === 'number' && !isNaN(value)
  }
  switch (getFieldType(field)) {
    case 'integer':
      return (typeof value === 'number' && !isNaN(value)) || value === ''
    case 'boolean':
      return typeof value === 'boolean'
    default:
      return typeof value === 'string'
  }
}

export function getFilterParameters(
  resource: IResource,
  parameters: ISearchParameters
): ISearchParameters {
  return Object.fromEntries(
    Object.entries(parameters).reduce((acc, [key, value]) => {
      const field = getField(resource, key)
      if (field) {
        const fieldValue = castFieldParameter(field, value as string | string[])
        if (isFieldValueValid(field, fieldValue)) {
          acc.push([key, fieldValue])
        }
      }
      return acc
    }, [])
  )
}

function returnDefaultValue(val: unknown, defaultValue?: unknown): unknown {
  return defaultValue !== undefined ? defaultValue : val
}

export function inputInitializer(input: string): unknown {
  switch (input) {
    case 'requestType':
    case 'searchLimitations':
    case 'categoryLimitations':
    case 'optgroup':
    case 'synonym':
    case 'expansion':
      return []

    case 'ruleEngine':
      return '{"type":"combination","operator":"all","value":"true","children":[]}'

    case 'rangeDate':
      return {
        fromDate: null,
        toDate: null,
      }

    case 'proportionalToAttribute':
      return {
        source_field_code: undefined,
        boost_impact: undefined,
        scale_factor: 1,
      }

    default:
      return ''
  }
}

export function valueInitializer(type: string, input?: string): unknown {
  switch (type) {
    case 'boolean':
      return false

    case 'array':
    case 'select':
      return []

    case 'number':
    case 'integer':
    case 'float':
    case 'slider':
      return 0

    case 'date':
    case 'dateTime':
      return null

    default:
      return input ? inputInitializer(input) : ''
  }
}

export function initResourceData(resource: IResource): Record<string, unknown> {
  const visibleChamp = Object.fromEntries(
    resource.supportedProperty
      .filter((property) => property?.gally?.visible)
      .map((item) => {
        return [
          item.title,
          returnDefaultValue(
            valueInitializer(getFieldType(item), item?.gally?.input),
            item.gally?.defaultValue
          ),
        ]
      })
  )
  return visibleChamp
}
