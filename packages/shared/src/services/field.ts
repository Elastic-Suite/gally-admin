import {
  IDropdownApiOptions,
  IDropdownStaticOptions,
  IField,
  IFieldCondition,
  IFieldConfig,
  IFieldConfigFormWithFieldset,
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

export function isFieldConfigFormWithFieldset(
  fieldConfig: IFieldConfig | IFieldConfigFormWithFieldset
): fieldConfig is IFieldConfigFormWithFieldset {
  return 'children' in fieldConfig
}
