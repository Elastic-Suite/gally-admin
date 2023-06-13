import React from 'react'
import {
  DataContentType,
  IFieldGuesserProps,
  IOption,
  valueInitializer,
} from '@elastic-suite/gally-admin-shared'
import FieldGuesser from './FieldGuesser'

interface IProps extends Omit<IFieldGuesserProps, 'onChange'> {
  onChange: (val: string) => void
}

function initOrUpdateModelConfigValue(
  optionConfig: IOption<unknown>,
  data?: unknown
): string {
  return JSON.stringify({
    [optionConfig?.jsonKeyValue as string]:
      data !== undefined
        ? String(data)
        : String(valueInitializer(optionConfig?.input)),
  })
}

function EditableModelConfig(props: IProps): JSX.Element {
  const { value, onChange, data, multipleInputConfiguration, label } = props

  function handleChange(optionConfig: IOption<string>, data?: unknown): void {
    return onChange(initOrUpdateModelConfigValue(optionConfig, data))
  }

  const inputDependencies =
    multipleInputConfiguration.inputDependencies instanceof Array
      ? multipleInputConfiguration.inputDependencies
      : [multipleInputConfiguration.inputDependencies]

  if (!inputDependencies) {
    return null
  }

  return (
    <>
      {inputDependencies.map((inputDependencie) => {
        if (data[inputDependencie?.field] === inputDependencie?.value) {
          const val = value
            ? JSON.parse(value as string)?.[inputDependencie?.jsonKeyValue]
            : null

          if (!val) {
            return handleChange(inputDependencie)
          }
          return (
            <FieldGuesser
              {...props}
              label={label}
              editable
              id={inputDependencie.input}
              input={inputDependencie.input as DataContentType}
              key={inputDependencie.input}
              value={val}
              optionConfig={inputDependencie}
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
