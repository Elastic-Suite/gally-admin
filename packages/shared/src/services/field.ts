import {
  IDropdownApiOptions,
  IDropdownStaticOptions,
  IField,
  IFieldCondition,
  IFieldState,
  IGallyProperty,
} from '../types'

function updateProperties(
  properties: IGallyProperty,
  key: string,
  value: number | boolean
): IGallyProperty {
  if (key === 'visible') {
    return {
      ...properties,
      visible: value as boolean,
    }
  } else if (key === 'editable') {
    return {
      ...properties,
      editable: value as boolean,
    }
  } else if (key === 'position') {
    return {
      ...properties,
      position: value as number,
    }
  }
  return properties
}

export function updatePropertiesAccordingToPath(
  field: IField,
  path: string
): IField {
  if (path?.includes('admin/settings')) {
    path = 'settings_attribute'
  } else {
    path = path?.replaceAll('/', '_').replace('_admin_', '')
  }
  if (field.gally?.context) {
    const [, newPropertiesvalues] = Object.entries(field.gally?.context)
      .filter(([key, _]) => key === path)
      .flat()
    if (newPropertiesvalues) {
      let newProperties = field.gally
      // eslint-disable-next-line no-return-assign
      Object.entries(newPropertiesvalues).forEach(
        ([property, propertyValue]) =>
          (newProperties = updateProperties(
            newProperties,
            property,
            propertyValue
          ))
      )
      return {
        ...field,
        gally: newProperties,
      }
    }
  }
  return field
}

export function hasFieldOptions(field: IField): boolean {
  return Boolean(field.gally?.options)
}

export function isDropdownStaticOptions(
  options: IDropdownStaticOptions | IDropdownApiOptions
): options is IDropdownStaticOptions {
  return 'values' in options
}

export function getFieldState(
  entity: Record<string, unknown>,
  depends?: IFieldCondition,
  state: IFieldState = {}
): IFieldState {
  if (!depends?.conditions) {
    return state
  }
  const { conditions, ...conditionalState } = depends
  const conditionActive = Object.entries(conditions).every(
    ([field, value]) => entity[field] === value
  )
  return {
    ...(conditionActive && conditionalState),
    ...state,
  }
}
