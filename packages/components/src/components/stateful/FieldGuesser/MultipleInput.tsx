import React, { SyntheticEvent, useEffect, useMemo } from 'react'
import {
  DataContentType,
  IFieldGuesserProps,
  IInputDependencies,
  valueInitializer,
} from '@elastic-suite/gally-admin-shared'
import FieldGuesser from './FieldGuesser'

interface IProps extends Omit<IFieldGuesserProps, 'onChange' | 'value'> {
  value?: string
  onChange?: (val: string, event?: SyntheticEvent<Element, Event>) => void
}

function MultipleInput(props: IProps): JSX.Element {
  const {
    multipleInputConfiguration: { inputDependencies },
    onChange,
    value,
    ...otherProps
  } = props

  const fields: IInputDependencies[] = useMemo(
    () =>
      (Array.isArray(inputDependencies)
        ? inputDependencies
        : [inputDependencies]
      ).filter(
        (inputDependency) =>
          inputDependency.value === otherProps.data[inputDependency.field]
      ),
    [inputDependencies, otherProps.data]
  )

  const defaultValue = useMemo(() => {
    const parsedValue = value ? JSON.parse(value) : {}
    inputDependencies.forEach((field) => {
      if (!parsedValue[field.jsonKeyValue]) {
        parsedValue[field.jsonKeyValue] = valueInitializer(
          field.input,
          field.input
        )
      }
    })
    return JSON.stringify(parsedValue)
  }, [value, inputDependencies])

  // Can be improved to avoid doing too much re-rendering by changing the behavior in the ResourceForm
  useEffect(() => {
    if (!value && onChange) {
      onChange(defaultValue)
    }
  }, [defaultValue, value, onChange])

  return (
    <>
      {fields.map((field) => {
        const parsedValue = JSON.parse(value || defaultValue)
        const newValue =
          parsedValue[field.jsonKeyValue] ??
          JSON.parse(defaultValue)[field.jsonKeyValue]

        function handleChange(
          _name: string,
          newValue: unknown,
          event?: React.SyntheticEvent<Element, Event>
        ): void {
          const updatedValue = {
            ...parsedValue,
            [field.jsonKeyValue]: newValue,
          }
          onChange?.(JSON.stringify(updatedValue), event)
        }

        return (
          <FieldGuesser
            key={field.jsonKeyValue}
            {...otherProps}
            input={field.input as DataContentType}
            editable
            id={field.input}
            value={newValue}
            onChange={handleChange}
          />
        )
      })}
    </>
  )
}

export default MultipleInput
