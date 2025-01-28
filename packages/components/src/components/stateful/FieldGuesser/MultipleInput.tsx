import React, { SyntheticEvent, useMemo } from 'react'
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
    ...otherProps
  } = props

  const fields: IInputDependencies[] = useMemo(() => {
    return (
      Array.isArray(inputDependencies) ? inputDependencies : [inputDependencies]
    ).filter(
      (inputDependencie) =>
        inputDependencie.value === otherProps.data[inputDependencie.field]
    )
  }, [inputDependencies, otherProps.data])

  return (
    <>
      {fields.map((field) => {
        const value = otherProps.value
          ? JSON.parse(otherProps.value as string)?.[field.jsonKeyValue] ??
            valueInitializer(field.input, field.input)
          : valueInitializer(field.input, field.input)

        function handleChange(
          _name: string,
          value: unknown,
          event?: React.SyntheticEvent<Element, Event>
        ): void {
          const newValue: Record<string, unknown> = otherProps.value
            ? JSON.parse(otherProps.value as string)
            : {}
          newValue[field?.jsonKeyValue] = value
          onChange(JSON.stringify(newValue), event)
        }

        return (
          <FieldGuesser
            key={field.jsonKeyValue}
            {...otherProps}
            input={field.input as DataContentType}
            editable
            id={field.input}
            value={value}
            onChange={handleChange}
          />
        )
      })}
    </>
  )
}

export default MultipleInput
