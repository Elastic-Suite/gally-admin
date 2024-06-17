import { act, waitFor } from '@testing-library/react'
import { SyntheticEvent } from 'react'

import { renderHookWithProviders } from '../utils/tests'

import { useFormError } from './useFormError'

describe('useFormError', () => {
  it('should validate without errors', () => {
    const onChangeSpy = jest.fn()
    const { result } = renderHookWithProviders(() =>
      useFormError(onChangeSpy, null)
    )
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)
    const event = {
      target: { validity: { valid: true } },
    } as unknown as SyntheticEvent
    act(() => result.current[0].onChange(42, event))
    expect(onChangeSpy).toHaveBeenCalledWith(42, event)
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)
  })

  it('should validate with error but not display it and trigger onChange', () => {
    const onChangeSpy = jest.fn()
    const { result } = renderHookWithProviders(() =>
      useFormError(onChangeSpy, 0)
    )
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)
    const event = {
      target: { validity: { valid: false, test: true } },
    } as unknown as SyntheticEvent
    act(() => result.current[0].onChange(42, event))
    expect(onChangeSpy).toHaveBeenCalled()
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)
  })

  it('should validate with error then display it and trigger onChange', async () => {
    const onChangeSpy = jest.fn()
    const event = {
      target: { validity: { valid: true, test: false } },
    } as unknown as SyntheticEvent

    const event2 = {
      target: { validity: { valid: false, test: true } },
    } as unknown as SyntheticEvent

    const { result } = renderHookWithProviders(() =>
      useFormError(onChangeSpy, 0, true)
    )
    act(() => result.current[0].onChange(42, event))
    expect(result.current[0].error).toEqual(false)
    expect(result.current[0].helperIcon).toEqual(undefined)
    expect(result.current[0].helperText).toEqual(undefined)

    act(() => result.current[0].onChange(42, event2))
    expect(onChangeSpy).toHaveBeenCalledWith(42, event)
    await waitFor(() => expect(result.current[0].error).toEqual(true))
    expect(result.current[0].helperIcon).toEqual('close')
    expect(result.current[0].helperText).toEqual('formError.test')
    act(() => result.current[0].onChange(42, event))
  })
})
