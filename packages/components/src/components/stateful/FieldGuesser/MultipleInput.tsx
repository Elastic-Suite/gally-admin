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
  const { multipleInputConfiguration, ...otherProps } = props

  const inputDependencies = useMemo(
    () =>
      multipleInputConfiguration.inputDependencies instanceof Array
        ? multipleInputConfiguration.inputDependencies
        : [multipleInputConfiguration.inputDependencies],
    [multipleInputConfiguration.inputDependencies]
  )

  const inputDependenciesByField = useMemo<
    Record<string, Record<string, IInputDependencies[]>>
  >(
    () =>
      inputDependencies.reduce(
        (acc: Record<string, Record<string, IInputDependencies[]>>, value) => {
          if (!acc[value.field]) {
            acc[value.field] = {
              [value.value]: [value],
            }
          } else if (!acc[value.field][value.value]) {
            acc[value.field][value.value] = [value]
          } else {
            acc[value.field][value.value].push(value)
          }
          return acc
        },
        {}
      ),
    [inputDependencies]
  )

  return (
    <>
      {Object.entries(inputDependenciesByField).map(([field, test]) => {
        return Object.entries(test).map(([fieldValue, inputDependencies]) => {
          if (otherProps.data[field] === fieldValue)
            return (
              <InputDepedencies
                key={fieldValue}
                inputDependencies={inputDependencies}
                fieldProps={otherProps}
              />
            )
          return null
        })
      })}
    </>
  )
}

interface IInputDependenciesProps {
  inputDependencies: IInputDependencies[]
  fieldProps: IProps
}

function InputDepedencies({
  inputDependencies,
  fieldProps,
}: IInputDependenciesProps): JSX.Element {
  const { value: currentValue, onChange } = fieldProps

  useEffect((): void => {
    const newData: Record<string, unknown> = {}

    const objectValue = currentValue ? JSON.parse(currentValue) : {}

    inputDependencies.forEach((inputDependencie) => {
      if (inputDependencie.jsonKeyValue in objectValue) {
        newData[inputDependencie.jsonKeyValue] =
          objectValue[inputDependencie.jsonKeyValue]
      } else {
        newData[inputDependencie?.jsonKeyValue] = valueInitializer(
          inputDependencie.input,
          inputDependencie.input
        )
      }
    })

    onChange(JSON.stringify(newData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {inputDependencies.map((inputDependencie) => {
        function handleChange(
          _name: string,
          value: unknown,
          event?: React.SyntheticEvent<Element, Event>
        ): void {
          const newValue: Record<string, unknown> = currentValue
            ? JSON.parse(currentValue as string)
            : {}
          newValue[inputDependencie?.jsonKeyValue] = value
          onChange(JSON.stringify(newValue), event)
        }

        const value = currentValue
          ? JSON.parse(currentValue as string)?.[inputDependencie?.jsonKeyValue]
          : null

        if (value === null || value === undefined) return null

        return (
          <FieldGuesser
            key={inputDependencie.jsonKeyValue}
            {...fieldProps}
            {...inputDependencie.fieldProps}
            input={inputDependencie.input as DataContentType}
            editable
            id={inputDependencie.input}
            onChange={handleChange}
            value={value}
          />
        )
      })}
    </>
  )
}

export default MultipleInput
