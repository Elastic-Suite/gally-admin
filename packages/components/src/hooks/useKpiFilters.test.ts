import { FormEvent, MutableRefObject, useContext } from 'react'
import { act } from '@testing-library/react'

import { renderHookWithProviders } from '../utils/tests'
import { ICatalogContext, catalogContext } from '../contexts'

import { useKpiFilters } from './useKpiFilters'

function useTestHook(): {
  filters: ReturnType<typeof useKpiFilters>
  catalog: ICatalogContext
} {
  return { filters: useKpiFilters(), catalog: useContext(catalogContext) }
}

function setFormValidity(
  filters: ReturnType<typeof useKpiFilters>,
  valid: boolean
): void {
  ;(filters.formRef as MutableRefObject<HTMLFormElement>).current = {
    checkValidity: () => valid,
  } as HTMLFormElement
}

const submitEvent = {
  preventDefault: jest.fn(),
} as unknown as FormEvent<HTMLFormElement>

describe('useKpiFilters', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('starts without filters', () => {
    const { result } = renderHookWithProviders(() => useKpiFilters())
    expect(result.current.apiFilters).toEqual({})
    expect(result.current.dateFilter).toEqual({ fromDate: null, toDate: null })
  })

  it('applies the dates and the scope on submit', () => {
    const { result } = renderHookWithProviders(useTestHook)
    setFormValidity(result.current.filters, true)

    act(() => {
      result.current.catalog.setCatalogId(1)
      result.current.catalog.setLocalizedCatalogId(2)
      result.current.filters.handleDateFilterChange({
        fromDate: new Date('2025-01-10'),
        toDate: new Date('2025-01-20'),
      })
    })
    // Applied filters do not change before submit
    expect(result.current.filters.apiFilters).toEqual({})

    act(() => result.current.filters.handleSubmit(submitEvent))
    expect(result.current.filters.apiFilters).toEqual({
      localizedCatalog: 'com_en',
      startDate: '2025-01-10',
      endDate: '2025-01-20',
    })
  })

  it('does not apply filters when the form is invalid', () => {
    const { result } = renderHookWithProviders(() => useKpiFilters())
    setFormValidity(result.current, false)

    act(() =>
      result.current.handleDateFilterChange({
        fromDate: new Date('2025-01-10'),
        toDate: null,
      })
    )
    act(() => result.current.handleSubmit(submitEvent))
    expect(result.current.apiFilters).toEqual({})
    expect(result.current.showError).toBe(true)
  })

  it('clears everything on reset', () => {
    jest.useFakeTimers()
    const { result } = renderHookWithProviders(useTestHook)
    setFormValidity(result.current.filters, true)

    act(() => {
      result.current.catalog.setCatalogId(1)
      result.current.filters.handleDateFilterChange({
        fromDate: new Date('2025-01-10'),
        toDate: null,
      })
    })
    act(() => result.current.filters.handleSubmit(submitEvent))
    expect(result.current.filters.apiFilters).toEqual({
      catalog: 'com',
      startDate: '2025-01-10',
    })

    // Clear all is ignored for a second after Apply.
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => result.current.filters.handleReset())
    expect(result.current.filters.apiFilters).toEqual({})
    expect(result.current.filters.dateFilter).toEqual({
      fromDate: null,
      toDate: null,
    })
    expect(result.current.catalog.catalog).toBeUndefined()
  })

  it('ignores Apply for a second after Apply', () => {
    jest.useFakeTimers()
    const { result } = renderHookWithProviders(() => useKpiFilters())
    setFormValidity(result.current, true)

    act(() => result.current.handleSubmit(submitEvent))
    expect(result.current.isRefreshDisabled).toBe(true)

    act(() =>
      result.current.handleDateFilterChange({
        fromDate: new Date('2025-01-10'),
        toDate: null,
      })
    )
    act(() => result.current.handleSubmit(submitEvent))
    expect(result.current.apiFilters).toEqual({})

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.isRefreshDisabled).toBe(false)
    act(() => result.current.handleSubmit(submitEvent))
    expect(result.current.apiFilters).toEqual({ startDate: '2025-01-10' })
  })

  it('disables Apply and Clear all while a KPI is loading', () => {
    const { result } = renderHookWithProviders(() => useKpiFilters())
    expect(result.current.isRefreshDisabled).toBe(false)

    let endLoading: () => void
    act(() => {
      endLoading = result.current.trackLoading()
    })
    expect(result.current.isRefreshDisabled).toBe(true)

    act(() => endLoading())
    expect(result.current.isRefreshDisabled).toBe(false)
  })
})
