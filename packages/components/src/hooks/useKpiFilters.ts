import {
  FormEvent,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { isValid } from 'date-fns'
import {
  ISearchParameters,
  createUTCDateSafe,
} from '@elastic-suite/gally-admin-shared'

import { IKpiFiltersContext, catalogContext } from '../contexts'
import type {
  IDoubleDatePickerErrors,
  IDoubleDatePickerValues,
} from '../components/atoms/form/DoubleDatePickerWithoutError'

import { useFilters, useFiltersRedirect } from './useFilters'
import { useRefreshCooldown } from './useRefreshCooldown'
import { useResource } from './useResource'

export function useKpiFilters(): IKpiFiltersContext {
  const formRef = useRef<HTMLFormElement>(null)

  const resource = useResource('Kpi')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [dateFilter, setDateFilter] = useState<IDoubleDatePickerValues>({
    fromDate: (activeFilters.startDate as string) ?? null,
    toDate: (activeFilters.endDate as string) ?? null,
  })
  const [showError, setShowError] = useState(false)
  const [filtersHaveError, setFiltersHaveError] = useState(false)
  const localizedCatalogContext = useContext(catalogContext)
  const [loadingCount, setLoadingCount] = useState(0)
  const [isRefreshCoolingDown, startRefreshCooldown] = useRefreshCooldown()

  const trackLoading = useCallback((): (() => void) => {
    setLoadingCount((count) => count + 1)
    return () => setLoadingCount((count) => count - 1)
  }, [])

  const isRefreshDisabled = loadingCount > 0 || isRefreshCoolingDown

  const filtersForUrl = useMemo(() => {
    const filters: ISearchParameters = { ...activeFilters }
    // We remove catalog filters from/to URL as they use a context
    // So they do not work easily with the useFiltersRedirect hook
    delete filters.catalog
    delete filters.localizedCatalog
    return filters
  }, [activeFilters])

  const apiFilters = useMemo(() => {
    const filters: ISearchParameters = { ...activeFilters }
    if (filters?.localizedCatalog) {
      delete filters.catalog
    }
    return filters
  }, [activeFilters])

  const pendingFilters = useMemo(() => {
    const filters: ISearchParameters = {}

    if (localizedCatalogContext?.localizedCatalog?.code) {
      filters.localizedCatalog = localizedCatalogContext.localizedCatalog?.code
    } else if (localizedCatalogContext?.catalog?.code) {
      filters.catalog = localizedCatalogContext.catalog.code
    }

    if (dateFilter.fromDate) {
      const startValue = createUTCDateSafe(new Date(dateFilter.fromDate))
      if (isValid(startValue)) {
        startValue.setUTCHours(0, 0, 0, 0)
        const [startDate] = startValue.toISOString().split('T')
        filters.startDate = startDate
      }
    }

    if (dateFilter.toDate) {
      const endValue = createUTCDateSafe(new Date(dateFilter.toDate))
      if (isValid(endValue)) {
        endValue.setUTCHours(23, 59, 59, 999)
        const [endDate] = endValue.toISOString().split('T')
        filters.endDate = endDate
      }
    }
    return filters
  }, [dateFilter, localizedCatalogContext])

  function handleFiltersError(errors: IDoubleDatePickerErrors): void {
    const filtersHaveError = Object.values(errors).some((e) => e)
    setFiltersHaveError(filtersHaveError)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (isRefreshDisabled) {
      return
    }
    setShowError(true)

    // Validate form
    if (!formRef.current?.checkValidity()) {
      return
    }

    // Check for custom errors
    if (filtersHaveError) {
      return
    }

    setActiveFilters({ ...pendingFilters })
    startRefreshCooldown()
  }

  function handleReset(): void {
    if (isRefreshDisabled) {
      return
    }
    startRefreshCooldown()

    // Reset form validation state
    setShowError(false)
    setFiltersHaveError(false)

    // Reset date filter
    setDateFilter({
      fromDate: null,
      toDate: null,
    })
    localizedCatalogContext.setCatalogId(null)
    localizedCatalogContext.setLocalizedCatalogId(-1)

    if (Object.values(activeFilters).length) {
      setActiveFilters({})
    }
  }

  const resourcePrefix = useMemo(
    () => resource?.title?.toLowerCase(),
    [resource]
  )
  useFiltersRedirect(0, filtersForUrl, '', true, resourcePrefix)

  return {
    formRef,
    dateFilter,
    handleDateFilterChange: setDateFilter,
    showError,
    handleFiltersError,
    apiFilters,
    handleSubmit,
    handleReset,
    trackLoading,
    isRefreshDisabled,
  }
}
