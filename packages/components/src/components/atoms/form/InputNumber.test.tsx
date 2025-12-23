import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { renderWithProviders } from '../../../utils/tests'
import InputNumber from './InputNumber'
import { TestId, generateTestId } from '../../../utils/testIds'

const integerFieldTestId = generateTestId(
  TestId.INPUT_TEXT,
  TestId.INPUT_INTEGER
)
const floatFieldTestId = generateTestId(TestId.INPUT_TEXT, TestId.INPUT_FLOAT)

describe('InputNumber', () => {
  // INTEGER SCENARIOS
  it('renders as type number for integer and only accepts digits', () => {
    const handleChange = jest.fn()
    renderWithProviders(
      <InputNumber value="" numberType="integer" onChange={handleChange} />
    )
    const input: HTMLInputElement = screen.getByTestId(integerFieldTestId)
    expect(input).toHaveAttribute('type', 'number')
    // It should change since 42 is a valid value
    fireEvent.change(input, { target: { value: '42' } })
    expect(input.value).toBe('42')
    expect(handleChange).toHaveBeenCalledWith(42, expect.anything())
    // Adding some invalid data after the integer
    fireEvent.change(input, { target: { value: '42abc' } })
    expect(input.value).toBe('')
    // Handle change should have been called with the last valid value
    expect(handleChange).toHaveBeenCalledWith(42, expect.anything())
  })

  it('shows integer error when invalid value entered and showError', () => {
    renderWithProviders(
      <InputNumber
        value="abc"
        numberType="integer"
        showError
        replacementErrorsMessages={{ invalidInteger: 'invalidInteger' }}
      />
    )
    const input: HTMLInputElement = screen.getByTestId(integerFieldTestId)
    fireEvent.change(input, { target: { value: '1.6' } })
    expect(screen.getByText('formError.invalidInteger')).toBeInTheDocument()
  })

  // FLOAT SCENARIOS
  it('renders as text/decimal for float', () => {
    renderWithProviders(<InputNumber value="" numberType="float" />)
    const input: HTMLInputElement = screen.getByTestId(floatFieldTestId)
    expect(input).toHaveAttribute('inputmode', 'decimal')
  })

  it('allows comma or dot input for float, calls onChange with float value', () => {
    const handleChange = jest.fn()
    renderWithProviders(
      <InputNumber value="" numberType="float" onChange={handleChange} />
    )
    const input: HTMLInputElement = screen.getByTestId(floatFieldTestId)
    // Typing "1,23"
    fireEvent.change(input, { target: { value: '1,23' } })
    expect(handleChange).toHaveBeenCalledWith(1.23, expect.anything())
    // Typing "4.56"
    fireEvent.change(input, { target: { value: '4.56' } })
    expect(handleChange).toHaveBeenCalledWith(4.56, expect.anything())
  })

  it('does not call onChange for float inputs ending with dot/comma', () => {
    const handleChange = jest.fn()
    renderWithProviders(
      <InputNumber value="" numberType="float" onChange={handleChange} />
    )
    const input: HTMLInputElement = screen.getByTestId(floatFieldTestId)
    fireEvent.change(input, { target: { value: '7.' } })
    // Value is updated internally but onChange not triggered
    expect(handleChange).not.toHaveBeenCalledWith(7, expect.anything())
    // Value stays as "7."
    expect(input.value).toBe('7.')
  })

  it('shows float error when invalid value entered and showError', () => {
    renderWithProviders(
      <InputNumber
        value="abc"
        numberType="float"
        showError
        replacementErrorsMessages={{ invalidFloat: 'invalidFloat' }}
      />
    )
    const input: HTMLInputElement = screen.getByTestId(floatFieldTestId)
    fireEvent.change(input, { target: { value: 'foo13' } })
    expect(screen.getByText('formError.invalidFloat')).toBeInTheDocument()
  })

  // PROP UPDATE SCENARIO
  it('updates local state when value prop changes', () => {
    const { rerender } = renderWithProviders(
      <InputNumber value="12" numberType="integer" />
    )
    const input: HTMLInputElement = screen.getByTestId(integerFieldTestId)
    expect(input.value).toBe('12')
    rerender(<InputNumber value="99" numberType="integer" />)
    expect(input.value).toBe('99')
  })

  // REQUIRED FIELD SCENARIOS
  it('shows required error when field is required and empty with showError', () => {
    renderWithProviders(
      <InputNumber value="" numberType="integer" required showError />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('does not show required error when field is required but showError is false', () => {
    renderWithProviders(
      <InputNumber value="" numberType="integer" required showError={false} />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shows required error when showError changes from false to true', () => {
    const { rerender } = renderWithProviders(
      <InputNumber value="" numberType="integer" required showError={false} />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()

    rerender(<InputNumber value="" numberType="integer" required showError />)
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })

  it('hides error when showError changes from true to false', () => {
    const { rerender } = renderWithProviders(
      <InputNumber value="" numberType="integer" required showError />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()

    rerender(
      <InputNumber value="" numberType="integer" required showError={false} />
    )
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('clears required error when value is provided', () => {
    const { rerender } = renderWithProviders(
      <InputNumber value="" numberType="integer" required showError />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()

    rerender(<InputNumber value="42" numberType="integer" required showError />)
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shows validation error even when integer field is required and has invalid value', () => {
    renderWithProviders(
      <InputNumber value="abc" numberType="integer" required showError />
    )
    // Should show validation error, not required error
    expect(screen.getByText('formError.invalidInteger')).toBeInTheDocument()
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('shows validation error even when float field is required and has invalid value', () => {
    renderWithProviders(
      <InputNumber value="abc" numberType="float" required showError />
    )
    // Should show validation error, not required error
    expect(screen.getByText('formError.invalidFloat')).toBeInTheDocument()
    expect(screen.queryByText('formError.valueMissing')).not.toBeInTheDocument()
  })

  it('handles required field for float type', () => {
    renderWithProviders(
      <InputNumber value="" numberType="float" required showError />
    )
    expect(screen.getByText('formError.valueMissing')).toBeInTheDocument()
  })
})
