import React, { useContext, useEffect } from 'react'
import {
  DataContentType,
  IFieldGuesserProps,
  IOption,
  IOptions,
  LoadStatus,
  valueInitializer,
} from '@elastic-suite/gally-admin-shared'
import { optionsContext } from '../../../contexts'
import FieldGuesser from './FieldGuesser'

interface IProps extends Omit<IFieldGuesserProps, 'onChange'> {
  onChange: (val: string) => void
}

function initOrUpdateModelConfigValue(
  optionConfig: IOption<unknown>,
  data?: unknown
): string {
  return JSON.stringify({
    [optionConfig?.value as string]:
      data !== undefined
        ? String(data)
        : String(valueInitializer(optionConfig?.input)),
  })
}

function EditableModelConfig(props: IProps): JSX.Element {
  const { field, value, onChange, data, options, label } = props
  const { fieldOptions, load, statuses } = useContext(optionsContext)

  function handleChange(optionConfig: IOption<string>, data?: unknown): void {
    return onChange(initOrUpdateModelConfigValue(optionConfig, data))
  }

  const optionsConfig = (options ??
    fieldOptions.get(field.property['@id']) ??
    []) as IOptions<string>

  useEffect(() => {
    if (!options && field) {
      load(field)
    }
  }, [field, load, options])

  if (
    !optionsConfig ||
    statuses.current.get(field.property['@id']) !== LoadStatus.SUCCEEDED ||
    !data?.[optionsConfig?.[0]?.field]
  ) {
    return null
  }

  return (
    <>
      {optionsConfig.map((optionConfig) => {
        if (data[optionConfig?.field] === optionConfig?.value) {
          const val = value
            ? JSON.parse(value as string)?.[optionConfig?.value]
            : null

          if (!val) {
            return handleChange(optionConfig)
          }
          return (
            <FieldGuesser
              {...props}
              label={label}
              editable
              id={optionConfig.input}
              input={optionConfig.input as DataContentType}
              key={optionConfig.input}
              value={val}
              optionConfig={optionConfig}
              onChange={handleChange}
            />
          )
        }
        return null
      })}
    </>
  )
}

export default EditableModelConfig
