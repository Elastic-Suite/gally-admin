export const boostModels = {
  constantScore: 'constant_score',
  attributeValue: 'attribute_value',
  behavioralData: 'behavioral_data',
} as const

interface IBoostModelRules {
  // Key of the model settings in the boost's modelConfig JSON, the same as
  // jsonKeyValue in the API's inputDependencies.
  configKey: string
  // Settings that must be filled. Dotted paths reach nested values.
  requiredFields: string[]
  // Any other rule on the model settings, run once the required ones are
  // filled.
  isValid?: (config: unknown) => boolean
}

export const constantScoreRange = { min: -99, max: 100 }

export function getScaleFactorError(value: number): string {
  return Number(value) > 0 ? '' : 'scaleFactorWrongFormat'
}

function hasValidScaleFactor(config: unknown): boolean {
  return (
    getScaleFactorError(
      (config as { scale_factor?: number })?.scale_factor as number
    ) === ''
  )
}

const modelRules: Record<string, IBoostModelRules> = {
  [boostModels.constantScore]: {
    configKey: 'constant_score_value',
    requiredFields: [],
    isValid: (config): boolean =>
      typeof config === 'number' &&
      config >= constantScoreRange.min &&
      config <= constantScoreRange.max,
  },
  [boostModels.attributeValue]: {
    configKey: 'attribute_value_config',
    requiredFields: ['source_field_code', 'boost_impact', 'scale_factor'],
    isValid: hasValidScaleFactor,
  },
  [boostModels.behavioralData]: {
    configKey: 'behavioral_data_value',
    requiredFields: [
      'data_type.metric',
      'data_type.timeframe',
      'data_type.calculation',
      'boost_impact',
      'scale_factor',
    ],
    isValid: hasValidScaleFactor,
  },
}

function getValue(config: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === 'object'
          ? (value as Record<string, unknown>)[key]
          : undefined,
      config
    )
}

function isFilled(value: unknown): boolean {
  return value !== undefined && value !== null && value !== ''
}

export function isBoostModelFieldRequired(
  model: string,
  field: string
): boolean {
  return Boolean(modelRules[model]?.requiredFields.includes(field))
}

function getModelRules(model: string): IBoostModelRules | undefined {
  const rules = modelRules[model]
  if (!rules) {
    // eslint-disable-next-line no-console
    console.error(
      `No validation rules are configured for the boost model "${model}" in services/boostModel.ts.`
    )
  }
  return rules
}

// Settings of one model.
export function isBoostModelConfigValid(
  model: string,
  config: unknown
): boolean {
  const rules = getModelRules(model)
  if (!rules) {
    return false
  }

  return (
    rules.requiredFields.every((field) => isFilled(getValue(config, field))) &&
    (rules.isValid?.(config) ?? true)
  )
}

export function isBoostModelConfigJsonValid(
  model: string,
  modelConfig?: string
): boolean {
  const rules = getModelRules(model)
  if (!rules) {
    return false
  }

  try {
    const config = JSON.parse(modelConfig ?? '')
    return isBoostModelConfigValid(model, config?.[rules.configKey])
  } catch {
    return false
  }
}
