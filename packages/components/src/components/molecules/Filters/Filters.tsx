import React, { FormEvent, ReactNode, useContext, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Collapse, InputAdornment, Stack } from '@mui/material'
import {
  IFieldConfig,
  IFieldOptions,
  IOption,
  rangeSeparator,
} from '@elastic-suite/gally-admin-shared'

import { optionsContext } from '../../../contexts'

import Button from '../../atoms/buttons/Button'
import Chip from '../../atoms/Chip/Chip'
import InputTextWithoutError from '../../atoms/form/InputTextWithoutError'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import FieldGuesser from '../../stateful/FieldGuesser/FieldGuesser'

import {
  Container,
  ContentForm,
  FacetteBox,
  FilterBox,
  FilterSecondaryButton,
  FilterTertiaryButton,
  FiltersBox,
  FiltersPaper,
  HeaderBox,
  SearchBox,
} from './Filters.styled'

interface IActiveFilter {
  filter: IFieldConfig
  label: string
  value: unknown
}

interface IProps {
  activeValues: Record<string, unknown>
  children?: ReactNode
  filters: IFieldConfig[]
  filterValues: Record<string, unknown>
  onApply: () => void
  onClear: (filter: IFieldConfig, value: unknown) => void
  onClearAll: () => void
  onFilterChange: (filter: IFieldConfig, value: unknown) => void
  onSearch: (value: string) => void
  searchValue?: string
  showSearch?: boolean
  dataTestId?: string
}

function getActiveFilterLabel(
  filter: IFieldConfig,
  value: unknown,
  fieldOptions: IFieldOptions
): string {
  const options =
    filter?.options ?? fieldOptions.get(filter?.field.property['@id']) ?? []

  if (filter.id.endsWith('[between]')) {
    value = (value as (string | number)[]).join('-')
  }

  const option: IOption<unknown> = options.find((option) => {
    return option.value === value
  })

  if (option) {
    return `${filter?.label}: ${option.label}`
  }
  return `${filter?.label}: ${value}`
}

function getActiveFilter(
  filter: IFieldConfig,
  value: unknown,
  fieldOptions: IFieldOptions
): { filter: IFieldConfig; label: string; value: unknown } {
  return {
    filter,
    label: getActiveFilterLabel(filter, value, fieldOptions),
    value,
  }
}

function Filters(props: IProps): JSX.Element {
  const {
    activeValues,
    children,
    filters,
    filterValues,
    onApply,
    onClear,
    onClearAll,
    onFilterChange,
    onSearch,
    searchValue,
    showSearch,
    dataTestId,
  } = props
  const [open, setOpen] = useState(false)
  const { t } = useTranslation('api')
  const { fieldOptions } = useContext(optionsContext)

  const filterMap = new Map<string, IFieldConfig>(
    filters.map((filter) => [filter.id, filter])
  )

  const activeFilters = Object.entries(activeValues)
    .filter(([_, value]) => value !== '')
    .reduce<IActiveFilter[]>((acc, [id, value]) => {
      const filter = filterMap.get(id)
      if (filter) {
        if (filter.id.endsWith('[between]')) {
          const val = value as (string | number)[]
          if (val[0] || val[1]) {
            acc.push(getActiveFilter(filter, val, fieldOptions))
          }
        } else if (filter.multiple) {
          return acc.concat(
            (value as unknown[]).map((v) =>
              getActiveFilter(filter, v, fieldOptions)
            )
          )
        } else {
          acc.push(
            getActiveFilter(
              filter,
              typeof value === 'boolean'
                ? value
                  ? t('filter.yes')
                  : t('filter.no')
                : value,
              fieldOptions
            )
          )
        }
      }
      return acc
    }, [])

  function toggleFilters(): void {
    setOpen((prevState) => !prevState)
  }

  function handleClear(filter: IFieldConfig, value: unknown): void {
    const filterValue = filterValues[filter.id]
    if (filter.multiple) {
      onClear(
        filter,
        (filterValue as unknown[]).filter((v) => v !== value)
      )
    } else {
      onClear(filter, '')
    }
  }

  function handleChange(name: string, value: unknown): void {
    const filter = filters.find((filter) => filter.id === name)
    if (filter) {
      onFilterChange(filter, value)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onApply()
  }

  function chipFilterLabelWithTraduction(label: string): string {
    const [key, value] = label.split(':')
    return `${t(key)}: ${value}`
  }

  return (
    <FiltersPaper elevation={0} data-testid={dataTestId}>
      <HeaderBox>
        {showSearch ? (
          <SearchBox>
            <InputTextWithoutError
              endAdornment={
                <InputAdornment position="end">
                  <IonIcon name="search" />
                </InputAdornment>
              }
              onChange={onSearch}
              placeholder={t('filters.search')}
              style={{ width: '220px' }}
              value={searchValue}
              dataTestId={dataTestId ? `${dataTestId}SearchBar` : undefined}
            />
          </SearchBox>
        ) : null}
        <FilterBox>
          <FilterSecondaryButton
            onClick={toggleFilters}
            endIcon={<IonIcon name="filter-outline" />}
            data-testid={dataTestId ? `${dataTestId}ToggleButton` : undefined}
          >
            {t('filters.filter')}{' '}
            {activeFilters.length > 0 && (
              <>
                (
                <span
                  data-testid={
                    dataTestId ? `${dataTestId}ActiveFiltersCount` : undefined
                  }
                >
                  {activeFilters.length}
                </span>
                )
              </>
            )}
          </FilterSecondaryButton>
          <FacetteBox
            data-testid={dataTestId ? `${dataTestId}FacetteBox` : undefined}
          >
            {activeFilters.map(({ filter, label, value }) => (
              <Chip
                key={`${filter.id}${rangeSeparator}${value}`}
                label={chipFilterLabelWithTraduction(label)}
                onDelete={(): void => handleClear(filter, value)}
                data-testid={
                  dataTestId ? `${dataTestId}${filter.id}Chip` : undefined
                }
              />
            ))}
          </FacetteBox>
          <FilterTertiaryButton
            onClick={onClearAll}
            endIcon={<IonIcon name="reload-outline" />}
            data-testid={dataTestId ? `${dataTestId}ClearAllButton` : undefined}
          >
            {t('filters.clearAll')}
          </FilterTertiaryButton>
        </FilterBox>
      </HeaderBox>
      <Collapse in={open} timeout="auto">
        <ContentForm onSubmit={handleSubmit}>
          <FiltersBox>
            {filters.map((filter) => (
              <FieldGuesser
                key={filter.id}
                {...filter}
                onChange={handleChange}
                showError
                label={t(filter.label)}
                useDropdownBoolean
                value={filterValues[filter.id]}
              />
            ))}
          </FiltersBox>
          <Stack spacing={1} direction="row">
            <Button
              type="submit"
              endIcon={<IonIcon name="checkmark-done-outline" />}
              data-testid={dataTestId ? `${dataTestId}ApplyButton` : undefined}
            >
              {t('filters.apply')}
            </Button>
            <Button
              display="tertiary"
              onClick={onClearAll}
              endIcon={<IonIcon name="reload-outline" />}
              data-testid={
                dataTestId ? `${dataTestId}ClearAllButton` : undefined
              }
            >
              {t('filters.clearAll')}
            </Button>
          </Stack>
        </ContentForm>
      </Collapse>
      {Boolean(children) && <Container>{children}</Container>}
    </FiltersPaper>
  )
}

export default Filters
