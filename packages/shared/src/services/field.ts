import {
  IDropdownApiOptions,
  IDropdownStaticOptions,
  IField,
  IFieldCondition,
  IFieldConfig,
  IFieldConfigFormWithFieldset,
  IFieldDepends,
  IFieldState,
} from '../types'

export enum IMainContext {
  GRID = 'grid',
  FORM = 'form',
}

export function updatePropertiesAccordingToPath(
  field: IField,
  path: string,
  mainContext: IMainContext
): IField {
  let result: IField = field
  if (path?.includes('admin/settings')) {
    path = 'settings_attribute'
  } else {
    path = path?.replaceAll('/', '_').replace('_admin_', '')
  }

  const mainContextGally = field.gally?.[mainContext as IMainContext]

  if (mainContextGally) {
    result = {
      ...result,
      gally: { ...field.gally, ...mainContextGally },
    }
  }

  if (field.gally?.context) {
    const newPropertiesvalues = Object.entries(field.gally?.context).find(
      ([key, _]) => key === path
    )
    if (newPropertiesvalues) {
      result = {
        ...result,
        gally: { ...field.gally, ...newPropertiesvalues[1] },
      }
    }
  }

  return result
}

export function hasFieldOptions(field: IField): boolean {
  return Boolean(field.gally?.options)
}

export function isDropdownStaticOptions(
  options: IDropdownStaticOptions | IDropdownApiOptions
): options is IDropdownStaticOptions {
  return 'values' in options && options.values.length > 0
}

/**
 * It works like an "or" for the first level, but if we have an array at the second level then it works like an "and" (all conditions must be true)
 */
function isConditionActive(
  entity: Record<string, unknown>,
  conditions: (IFieldCondition | IFieldCondition[])[] | IFieldCondition
): boolean {
  if (!Array.isArray(conditions)) {
    return entity[conditions.field] === conditions.value
  }
  let conditionActive = false
  let index = 0
  while (!conditionActive && index < conditions.length) {
    const item = conditions[index]
    if (Array.isArray(item)) {
      conditionActive = item.every(
        ({ field, value }) => entity[field] === value
      )
    } else {
      const { field, value } = item
      conditionActive = entity[field] === value
    }
    index++
  }
  return conditionActive
}

/**
 * Allows to return a state based on conditions dependent on another field.
 * The field [field name] depends on the condition [condition] to be [type].
 */
export function getFieldState(
  entity?: Record<string, unknown>,
  depends?: IFieldDepends,
  state: IFieldState = {}
): IFieldState {
  if (!entity) return {}
  if (!depends?.conditions) {
    return state
  }
  const { conditions, type } = depends

  const newState: IFieldState = {}

  switch (type) {
    case 'visible':
      newState.visible = isConditionActive(entity, conditions)
      break
    case 'enabled':
      newState.disabled = !isConditionActive(entity, conditions)
  }

  return {
    ...newState,
    ...state,
  }
}

/**
 * return fieldState without the states that are not field props like "visible"
 */
export function getPropsFromFieldState(
  entity?: Record<string, unknown>,
  depends?: IFieldDepends,
  state: IFieldState = {}
): Omit<IFieldState, 'visible'> {
  const { visible, ...otherProps } = getFieldState(entity, depends, state)
  return otherProps
}

export function isFieldConfigFormWithFieldset(
  fieldConfig: IFieldConfig | IFieldConfigFormWithFieldset
): fieldConfig is IFieldConfigFormWithFieldset {
  return 'children' in fieldConfig
}
