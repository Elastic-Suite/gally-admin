import { act } from '@testing-library/react'

import {
  fetchApi,
  fieldDropdown,
  fieldDropdownWithApiOptions,
  fieldRef,
} from '@elastic-suite/gally-admin-shared'
import { renderHookWithProviders } from '../utils/tests'

import { useOptions } from './useOptions'

describe('useOptions', () => {
  it('should load the field schema static options', async () => {
    const { result } = renderHookWithProviders(() => useOptions())
    expect(result.current.fieldOptions).toEqual(new Map())
    await act(() => result.current.load(fieldDropdown))
    expect(
      result.current.fieldOptions.get(fieldDropdown.property['@id'])
    ).toEqual([
      { value: 'test1', label: 'option_test1' },
      { value: 'test2', label: 'option_test2' },
    ])
  })

  it('should load the field schema api options', async () => {
    const { result } = renderHookWithProviders(() => useOptions())
    expect(result.current.fieldOptions).toEqual(new Map())
    await act(() => result.current.load(fieldDropdownWithApiOptions))
    expect(
      result.current.fieldOptions.get(
        fieldDropdownWithApiOptions.property['@id']
      )
    ).toEqual([
      { value: 'position', label: 'Position', options: undefined },
      { value: 'id', label: 'Id', options: undefined },
      { value: 'stock.status', label: 'Stock status', options: undefined },
      { value: 'sku', label: 'Sku', options: undefined },
      { value: 'price', label: 'Price', options: undefined },
    ])
  })

  it('should load the field resource options', async () => {
    ;(fetchApi as jest.Mock).mockClear()
    const { result } = renderHookWithProviders(() => useOptions())
    expect(result.current.fieldOptions).toEqual(new Map())
    await act(() => result.current.load(fieldRef))
    expect(result.current.fieldOptions.get(fieldRef.property['@id'])).toEqual([
      { id: 1, value: 1, label: '/metadata/1' },
      { id: 2, value: 2, label: '/metadata/2' },
    ])
    expect(fetchApi).toHaveBeenCalledTimes(1)
  })

  it('should not load the options twice', async () => {
    ;(fetchApi as jest.Mock).mockClear()
    const { result } = renderHookWithProviders(() => useOptions())
    expect(result.current.fieldOptions).toEqual(new Map())
    await act(() =>
      Promise.all([
        result.current.load(fieldRef),
        result.current.load(fieldRef),
      ]).then(() => undefined)
    )
    expect(result.current.fieldOptions.get(fieldRef.property['@id'])).toEqual([
      { id: 1, value: 1, label: '/metadata/1' },
      { id: 2, value: 2, label: '/metadata/2' },
    ])
    expect(fetchApi).toHaveBeenCalledTimes(1)
  })

  describe('loadOptions', () => {
    const url = '/product_sorting_options'
    const expectedOptions = [
      { value: 'position', label: 'Position' },
      { value: 'id', label: 'Id' },
      { value: 'stock.status', label: 'Stock status' },
      { value: 'sku', label: 'Sku' },
      { value: 'price', label: 'Price' },
    ]

    it('should load options from an api url under the given id', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useOptions())
      expect(result.current.fieldOptions).toEqual(new Map())
      await act(() => result.current.loadOptions('sortingOptions', url))
      expect(result.current.fieldOptions.get('sortingOptions')).toEqual(
        expectedOptions
      )
      expect(fetchApi).toHaveBeenCalledTimes(1)
      expect((fetchApi as jest.Mock).mock.calls[0]).toContain(url)
    })

    it('should not load the same id twice', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useOptions())
      await act(() =>
        Promise.all([
          result.current.loadOptions('sortingOptions', url),
          result.current.loadOptions('sortingOptions', url),
        ]).then(() => undefined)
      )
      expect(result.current.fieldOptions.get('sortingOptions')).toEqual(
        expectedOptions
      )
      expect(fetchApi).toHaveBeenCalledTimes(1)
    })

    it('should pass the search parameters to fetchApi', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useOptions())
      await act(() =>
        result.current.loadOptions('sortingOptions', url, { field: 'metric' })
      )
      expect((fetchApi as jest.Mock).mock.calls[0]).toContain(url)
      expect((fetchApi as jest.Mock).mock.calls[0]).toContainEqual({
        field: 'metric',
      })
    })

    it('should share its cache with load for fields with api options', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useOptions())
      const fieldId = fieldDropdownWithApiOptions.property['@id']
      await act(() => result.current.loadOptions(fieldId, url))
      await act(() => result.current.load(fieldDropdownWithApiOptions))
      expect(result.current.fieldOptions.get(fieldId)).toEqual(expectedOptions)
      expect(fetchApi).toHaveBeenCalledTimes(1)
    })
  })
})
