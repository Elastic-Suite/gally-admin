import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'next-i18next'
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

import NoAttributes from '../../atoms/noAttributes/NoAttributes'
import Button from '../../atoms/buttons/Button'
import FieldGuesser from '../../stateful/FieldGuesser/FieldGuesser'
import FiltersGuesser from '../../stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '../../stateful/TableGuesser/TableGuesser'

const FitlerContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
})

const Paragraph = styled('p')(({ theme }) => ({
  marginBottom: 0,
  marginTop: theme.spacing(1),
}))

function isObjectNotEmpty(object: object): boolean {
  return Object.values(object).some((value) => value)
}
interface IProps {
  Field?: FunctionComponent<IFieldGuesserProps>
  active?: boolean
  activeFilters: ISearchParameters
  diffDefaultValues?: boolean
  getTableConfigs?: (rows: ITableRow[]) => ITableConfig[]
  filters?: ISearchParameters
  isFacets?: boolean
  resourceName: string
  setActiveFilters: Dispatch<SetStateAction<ISearchParameters>>
  urlParams?: string
  showSearch?: boolean
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

function ResourceTable(props: IProps): JSX.Element {
  const { t } = useTranslation('resourceTable')
  const {
    Field,
    active,
    activeFilters,
    diffDefaultValues,
    getTableConfigs,
    filters,
    isFacets,
    resourceName,
    setActiveFilters,
    urlParams,
    showSearch,
  } = props

  const resource = useResource(resourceName)
  const [page, setPage] = usePage()
  const [searchValue, setSearchValue] = useSearch()
  const parameters = useFilterParameters(activeFilters, filters)
  useFiltersRedirect(page, activeFilters, searchValue, active ? active : true)

  const rowsPerPageOptions = defaultRowsPerPageOptions
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)

  const [resourceData, { massUpdate, replace, update }] =
    useApiEditableList<ISourceField>(
      resource,
      page,
      rowsPerPage,
      parameters,
      searchValue,
      urlParams ? `${resource.url}${urlParams}` : null
    )
  const { data, error } = resourceData

  const tableRows = data?.['hydra:member'] as unknown as ITableRow[]

  console.log(tableRows)

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
    value: boolean | number | string
  ): void {
    if (update) {
      update(id, { [name]: value })
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
      const entries = Object.entries(row).filter(
        ([key, value]) => value !== tableRows?.[index][key]
      )

      if (entries.length > 0) {
        replace({
          ...tableRows?.[index],
          ...Object.fromEntries([
            [
              entries?.[0]?.[0],
              entries?.[0]?.[1] === undefined ? null : entries?.[0]?.[1],
            ],
          ]),
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
    return (
      <>
        <NoAttributes
          title={isFacets ? t('facets.none') : t('attributes.none')}
          btnTitle={isFacets ? t('facets.none.btn') : t('attributes.none.btn')}
          btnHref="admin/settings/attributes"
        />
      </>
    )
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
      >
        {Boolean(diffDefaultValues) && (
          <FitlerContent>
            <Button
              disabled={diffCount === 0}
              display="secondary"
              onClick={handleReset}
            >
              {t('default.button')}
            </Button>
            <Paragraph
              dangerouslySetInnerHTML={{
                __html: t('default.customValue', {
                  count: diffCount,
                  value: `<strong>${diffCount}</strong>`,
                }),
              }}
            />
          </FitlerContent>
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
        onPageChange={handlePageChange}
        onRowUpdate={handleRowChange}
        onRowsPerPageChange={onRowsPerPageChange}
        resource={resource}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        tableConfigs={getTableConfigs?.(tableRows)}
        tableRows={tableRows}
      />
    </>
  )
}

ResourceTable.defaultProps = {
  Field: FieldGuesser,
}

export default ResourceTable
