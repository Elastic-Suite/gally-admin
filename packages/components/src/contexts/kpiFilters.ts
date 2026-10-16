import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  createContext,
} from 'react'
import { ISearchParameters } from '@elastic-suite/gally-admin-shared'

import type {
  IDoubleDatePickerErrors,
  IDoubleDatePickerValues,
} from '../components/atoms/form/DoubleDatePickerWithoutError'

export interface IKpiFiltersContext {
  formRef: RefObject<HTMLFormElement>
  dateFilter: IDoubleDatePickerValues
  handleDateFilterChange: Dispatch<SetStateAction<IDoubleDatePickerValues>>
  showError: boolean
  handleFiltersError: (errors: IDoubleDatePickerErrors) => void
  apiFilters: ISearchParameters
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  handleReset: () => void
  trackLoading: () => () => void
  isRefreshDisabled: boolean
}

export const kpiFiltersContext = createContext<IKpiFiltersContext>(null)
