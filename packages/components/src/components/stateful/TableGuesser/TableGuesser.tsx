import React, {
  ChangeEvent,
  FunctionComponent,
  SyntheticEvent,
  useRef,
  useState,
} from 'react'
import {
  IField,
  IFieldConfig,
  IFieldGuesserProps,
  IHydraMember,
  IResource,
  IResourceEditableMassReplace,
  IResourceEditableMassUpdate,
  ITableConfig,
  ITableRow,
  defaultPageSize,
} from '@elastic-suite/gally-admin-shared'

import { useApiEditableFieldOptions, useApiHeaders } from '../../../hooks'

import StickyBar from '../../molecules/CustomTable/StickyBar/StickyBar'
import PagerTable from '../../organisms/PagerTable/PagerTable'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TableStickyBar from '../TableStickyBar/TableStickyBar'

interface IProps<T extends IHydraMember> {
  Field?: FunctionComponent<IFieldGuesserProps>
  count?: number
  currentPage?: number
  diffRows?: ITableRow[]
  onMassupdate: IResourceEditableMassUpdate<T>
  onMassreplace: IResourceEditableMassReplace<T>
  onPageChange: (page: number) => void
  onRowUpdate?: (
    id: string | number,
    name: string,
    value: boolean | number | string,
    event: SyntheticEvent
  ) => void
  resource: IResource
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
  onRowsPerPageChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  noResult?: boolean
  tableConfigs?: ITableConfig[]
  tableRows: ITableRow[]
  hasEditLink?: boolean
  editLink?: string
}

function TableGuesser<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const {
    Field,
    count,
    currentPage,
    diffRows,
    onMassupdate,
    onMassreplace,
    onPageChange,
    onRowUpdate,
    resource,
    rowsPerPage,
    rowsPerPageOptions,
    onRowsPerPageChange,
    noResult,
    tableConfigs,
    tableRows,
    hasEditLink,
    editLink,
  } = props
  const tableHeaders = useApiHeaders(resource) as IFieldConfig[]
  const fieldOptions = useApiEditableFieldOptions(resource)

  const tableRef = useRef<HTMLDivElement>()
  const [selectedField, setSelectedField] = useState<IField | ''>('')
  const [selectedValue, setSelectedValue] = useState<boolean | ''>('')
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([])

  const withSelection =
    selectedRows?.length !== undefined &&
    tableHeaders.some((header) => header?.editable)
  const activeRows = tableRows.filter(
    (_, index) => !(tableConfigs?.[index]?.selection.disabled ?? false)
  )
  const massiveSelectionState =
    withSelection && selectedRows
      ? selectedRows.length === activeRows.length
      : false
  const massiveSelectionIndeterminate =
    withSelection && selectedRows.length > 0
      ? selectedRows.length < activeRows.length
      : false

  function handleSelection(rowIds: (string | number)[] | boolean): void {
    if (rowIds instanceof Array) {
      setSelectedRows(rowIds)
    } else if (rowIds) {
      setSelectedRows(activeRows.map((row) => row.id))
    } else {
      setSelectedRows([])
    }
  }

  function handleChangeField(id: IField | ''): void {
    setSelectedField(id)
  }

  function handleChangeValue(_: string, value: boolean | ''): void {
    setSelectedValue(value)
  }

  function handleApply(): void {
    if (selectedField !== '') {
      if (onMassupdate) {
        onMassupdate(selectedRows, {
          [selectedField.title]: selectedValue,
        } as unknown as Partial<T>)
      } else if (onMassreplace) {
        onMassreplace(selectedRows, {
          [selectedField.title]: selectedValue,
        } as unknown as Omit<T, '@id' | '@type'>)
      }
    }
  }

  return (
    <>
      <PagerTable
        Field={Field}
        count={count}
        currentPage={currentPage ?? 0}
        diffRows={diffRows}
        massiveSelectionState={massiveSelectionState}
        massiveSelectionIndeterminate={massiveSelectionIndeterminate}
        onPageChange={onPageChange}
        onRowUpdate={onRowUpdate}
        onSelection={handleSelection}
        ref={tableRef}
        rowsPerPage={rowsPerPage ?? defaultPageSize}
        rowsPerPageOptions={rowsPerPageOptions ?? []}
        selectedRows={selectedRows}
        tableConfigs={tableConfigs}
        tableHeaders={tableHeaders}
        tableRows={tableRows}
        onRowsPerPageChange={onRowsPerPageChange}
        noResult={noResult}
        withSelection={withSelection}
        hasEditLink={hasEditLink}
        editLink={editLink}
      />
      <StickyBar positionRef={tableRef} show={selectedRows.length > 0}>
        <TableStickyBar
          field={selectedField}
          fieldOptions={fieldOptions}
          fieldValue={selectedValue}
          massiveSelectionState={massiveSelectionState}
          massiveSelectionIndeterminate={massiveSelectionIndeterminate}
          onApply={handleApply}
          onChangeField={handleChangeField}
          onChangeValue={handleChangeValue}
          onSelection={handleSelection}
          selectedRows={selectedRows}
          withSelection={withSelection}
        />
      </StickyBar>
    </>
  )
}

TableGuesser.defaultProps = {
  Field: FieldGuesser,
}

export default TableGuesser
