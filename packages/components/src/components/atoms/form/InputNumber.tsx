import React, { SyntheticEvent, useEffect, useState } from 'react'
import InputText, { IInputTextErrorProps } from './InputText'
import { TestId } from '../../../utils/testIds'

interface IFieldNumberProps {
  numberType?: 'integer' | 'float'
  value: string | number
}

interface IInputTextNumberProps
  extends IFieldNumberProps,
    Omit<IInputTextErrorProps, 'value'> {}

function InputNumber(props: IInputTextNumberProps): JSX.Element {
  const { numberType, value, ...inputProps } = props

  const [localValue, setLocalValue] = useState<string | number>(value)

  const isInteger = numberType === 'integer'

  // Sync localValue when external value prop changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleIntegerChange = (
    newValue: string | number,
    e: SyntheticEvent<Element, Event>
  ): void => {
    const stringValue = String(newValue)

    // Only format when passing up (remove all non-digits)
    const formattedValue = stringValue.replace(/\D/g, '')

    // Case when nothing remains after replacing
    if (formattedValue.trim() === '') {
      setLocalValue(value)
      return
    }

    const numericValue = parseInt(formattedValue, 10)
    // Do not trigger change when value has not changed after formatting
    if (numericValue === localValue) {
      return
    }

    // Update local state
    setLocalValue(numericValue)
    // Call the original onChange if it exists
    inputProps.onChange?.(numericValue, e)
  }

  const handleFloatChange = (
    newValue: string | number,
    e: SyntheticEvent<Element, Event>
  ): void => {
    const stringValue = String(newValue)

    // Do not pass up the change if it ends with dot or comma
    // Allow also empty values
    if (stringValue.trim() === '' || /[.,]$/.test(stringValue)) {
      // Update local state to show what user is typing
      setLocalValue(stringValue.trim())
      return
    }

    // Only format when passing up (replace comma with dot for storage)
    const formattedValue =
      stringValue.replace(/,/g, '.').replace(/[^\d.]/g, '') ?? ''

    // Case when nothing remains after replacing
    if (formattedValue.trim() === '') {
      setLocalValue(value)
      return
    }

    const numericValue = parseFloat(formattedValue)

    // Do not trigger change when value has not changed after formatting
    if (numericValue === localValue) {
      return
    }

    // Update local state
    setLocalValue(numericValue)
    // Call the original onChange if it exists
    inputProps.onChange?.(numericValue, e)
  }

  const additionalValidator = (value: string | number): string => {
    const stringValue = String(value)
    // Mark invalid when ending with dot or comma
    if (/[.,]$/.test(stringValue)) {
      return 'invalidFloat'
    }
    // For integer: allow only digits
    if (isInteger) {
      return /^\d*$/.test(stringValue) ? '' : 'invalidInteger'
    }
    // For float: allow digits, commas, and dots (but not at the end)
    return /^[\d,.\s]*$/.test(stringValue) ? '' : 'invalidFloat'
  }

  if (isInteger) {
    return (
      <InputText
        {...inputProps}
        componentId={TestId.INPUT_INTEGER}
        onChange={handleIntegerChange}
        type="number"
        value={localValue}
        additionalValidator={additionalValidator}
      />
    )
  }

  return (
    <InputText
      {...inputProps}
      inputProps={{ ...inputProps.inputProps, inputMode: 'decimal' }}
      componentId={TestId.INPUT_FLOAT}
      onChange={handleFloatChange}
      type="text"
      value={localValue}
      additionalValidator={additionalValidator}
      style={{ maxWidth: '80px', minWidth: '80px', ...inputProps.style }}
    />
  )
}

export default InputNumber
