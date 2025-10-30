import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { TFunction, useTranslation } from 'next-i18next'
import { styled } from '@mui/system'
import {
  IFieldGuesserProps,
  ISearchParameters,
  ISourceField,
  ITableConfig,
  ITableRow,
  LoadStatus,
  defaultPageSize,
  defaultRowsPerPageOptions,
  getNameFromDefault,
} from '@elastic-suite/gally-admin-shared'

import {
  useApiEditableList,
  useFilterParameters,
  useFiltersRedirect,
  usePage,
  useResource,
  useSearch,
} from '../../../hooks'

import NoAttributes, {
  INoAttributesProps,
} from '../../atoms/noAttributes/NoAttributes'
import Button from '../../atoms/buttons/Button'
import FieldGuesser from '../../stateful/FieldGuesser/FieldGuesser'
import FiltersGuesser from '../../stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '../../stateful/TableGuesser/TableGuesser'
import IonIcon from '../../atoms/IonIcon/IonIcon'
import { TestId, generateTestId } from '../../../utils/testIds'

const FilterContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
})

const Paragraph = styled('p')(({ theme }) => ({
  marginBottom: 0,
  marginTop: theme.spacing(1),
}))

function getProps(resourceName: string, t: TFunction): INoAttributesProps {
  switch (resourceName) {
    case 'FacetConfiguration':
      return {
        title: t('facets.none'),
        btnTitle: t('facets.none.btn'),
        btnHref: 'admin/settings/attributes',
      }

    case 'SourceField':
      return {
        title: t('attributes.none'),
        btnTitle: t('attributes.none.btn'),
        btnHref: 'admin/settings/attributes',
      }

    case 'Boost':
      return {
        title: t('boost.none'),
        btnTitle: t('boost.none.btn'),
        btnHref: './create',
        absolutLink: false,
      }
    case 'Thesaurus':
      return {
        title: t('thesaurus.none'),
        btnTitle: t('thesaurus.none.btn'),
        btnHref: './create',
        absolutLink: false,
      }
  }
}

function isObjectNotEmpty(object: object): boolean {
  return Object.values(object).some((value) => value)
}
export interface IResourceTable {
  Field?: FunctionComponent<IFieldGuesserProps>
  active?: boolean
  activeFilters: ISearchParameters
  diffDefaultValues?: boolean
  getTableConfigs?: (rows: ITableRow[]) => ITableConfig[]
  filters?: ISearchParameters
  resourceName: string
  setActiveFilters: Dispatch<SetStateAction<ISearchParameters>>
  urlParams?: string
  showSearch?: boolean
  hasEditLink?: boolean
  editLink?: string
  rowsPerPage?: number
}

const listOfDefaultFacets = [
  'defaultCoverageRate',
  'defaultDisplayMode',
  'defaultIsRecommendable',
  'defaultIsVirtual',
  'defaultMaxSize',
  'defaultSortOrder',
  'defaultPosition',
]

function ResourceTable(props: IResourceTable): JSX.Element {
  const { t } = useTranslation('resourceTable')
  const {
    Field,
    active,
    activeFilters,
    diffDefaultValues,
    getTableConfigs,
    filters,
    resourceName,
    setActiveFilters,
    urlParams,
    showSearch,
    hasEditLink,
    editLink,
    rowsPerPage: rowsPerPageValue,
  } = props

  const resource = useResource(resourceName)
  const [page, setPage] = usePage()
  const [searchValue, setSearchValue] = useSearch()

  const parameters = useFilterParameters(activeFilters, filters)
  useFiltersRedirect(page, activeFilters, searchValue, active)

  const rowsPerPageOptions = defaultRowsPerPageOptions
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    rowsPerPageValue ?? defaultPageSize
  )

  const [withDebounce, setWithDebounce] = useState(false)

  const [resourceData, { massUpdate, massReplace, replace, update }] =
    useApiEditableList<ISourceField>(
      resource,
      page,
      rowsPerPage,
      parameters,
      searchValue,
      urlParams ? `${resource.url}${urlParams}` : null,
      searchValue.trim() === '' ? false : withDebounce
    )

  useEffect(() => {
    setWithDebounce(true)
  }, [resourceData])

  const { data, error } = resourceData

  const tableRows = data?.['hydra:member'] as unknown as ITableRow[]
  const diffRows: ITableRow[] = useMemo(() => {
    if (diffDefaultValues && tableRows) {
      const newTableRows = tableRows.map((itemTableRow) => {
        const newDefault = listOfDefaultFacets.map((itemDefaultFacets) => {
          return { [itemDefaultFacets]: itemTableRow[itemDefaultFacets] }
        })
        return Object.assign({}, itemTableRow, ...newDefault)
      })

      return newTableRows.map((row) =>
        Object.fromEntries([
          ...Object.entries(row)
            .filter(([key]) => key.startsWith('default'))
            .map(([key, value]) => [getNameFromDefault(key), value]),
        ])
      ) as ITableRow[]
    }
    return []
  }, [diffDefaultValues, tableRows])

  const diffCount = useMemo(
    () =>
      diffRows.reduce(
        (acc, row, index) =>
          acc +
          Object.entries(row).reduce(
            (acc, [key, value]) =>
              acc + Number(value !== tableRows?.[index][key]),
            0
          ),
        0
      ),
    [diffRows, tableRows]
  )

  if (error || !data) {
    return null
  }

  function handleFilterChange(activeFilters: ISearchParameters): void {
    setActiveFilters(activeFilters)
    setPage(0)
  }

  function handleSearchValue(search: string): void {
    setSearchValue(search)
    setPage(0)
  }

  function handlePageChange(page: number): void {
    setPage(page)
  }

  function handleRowChange(
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent,
    showError: boolean
  ): void {
    const validity = (event.target as HTMLInputElement)?.checkValidity()
    if (update) {
      update(id, { [name]: value }, !showError || validity)
    } else if (replace) {
      replace(
        { id, [name]: value } as unknown as ISourceField,
        !showError || validity
      )
    }
  }

  function onRowsPerPageChange(
    event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    event && setRowsPerPage(Number(event.target.value))
    setPage(0)
  }

  function handleReset(): void {
    diffRows.forEach((row, index) => {
      const entries = Object.entries(row)
        .filter(([key, value]) => value !== tableRows?.[index][key])
        .map((item) => {
          return [item[0], item?.[1] ?? null]
        })
      if (entries.length > 0) {
        replace({
          ...tableRows?.[index],
          ...Object.fromEntries(entries),
        } as unknown as ISourceField)
      }
    }, [])
  }

  const filterOrSearchAreUp =
    searchValue !== '' || isObjectNotEmpty(activeFilters)

  if (
    data['hydra:member'].length === 0 &&
    resourceData.status === LoadStatus.SUCCEEDED &&
    !filterOrSearchAreUp
  ) {
    return <NoAttributes {...getProps(resourceName, t)} />
  }
  return (
    <>
      <FiltersGuesser
        activeFilters={activeFilters}
        apiData={data}
        onFilterChange={handleFilterChange}
        onSearch={handleSearchValue}
        resource={resource}
        searchValue={searchValue}
        showSearch={showSearch}
        componentId={resourceName}
      >
        {Boolean(diffDefaultValues) && (
          <FilterContent>
            <Button
              disabled={diffCount === 0}
              display="secondary"
              onClick={handleReset}
              endIcon={<IonIcon name="reload-outline" />}
              componentId="resetDefaultValues"
            >
              {t('default.button')}
            </Button>
            <Paragraph
              data-testid={generateTestId(
                TestId.RESOURCE_TABLE_NB_CUSTOM_VALUES_MESSAGE
              )}
              dangerouslySetInnerHTML={{
                __html: t('default.customValue', {
                  count: diffCount,
                  value: `<strong>${diffCount}</strong>`,
                }),
              }}
            />
          </FilterContent>
        )}
      </FiltersGuesser>
      <TableGuesser
        Field={Field}
        count={data['hydra:totalItems']}
        currentPage={page}
        diffRows={diffRows}
        noResult={
          data['hydra:member'].length === 0 &&
          resourceData.status === LoadStatus.SUCCEEDED &&
          filterOrSearchAreUp
        }
        onMassupdate={massUpdate}
        onMassreplace={massReplace}
        onPageChange={handlePageChange}
        onRowUpdate={handleRowChange}
        onRowsPerPageChange={onRowsPerPageChange}
        resource={resource}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        tableConfigs={getTableConfigs?.(tableRows)}
        tableRows={tableRows}
        hasEditLink={hasEditLink}
        editLink={editLink}
        componentId={resourceName}
      />
    </>
  )
}

ResourceTable.defaultProps = {
  Field: FieldGuesser,
}

export default ResourceTable
