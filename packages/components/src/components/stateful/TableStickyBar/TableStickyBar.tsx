import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Box, Checkbox } from '@mui/material'
import { styled } from '@mui/system'

import {
  IField,
  IOptions,
  getFieldHeader,
} from '@elastic-suite/gally-admin-shared'

import Button from '../../atoms/buttons/Button'
import Dropdown from '../../atoms/form/DropDown'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import Form from '../../atoms/form/Form'

const ActionsButtonsContainer = styled(Box)({
  marginLeft: 'auto',
})

interface IProps {
  field: IField | ''
  fieldOptions: IOptions<IField>
  fieldValue: unknown
  massiveSelectionState?: boolean
  massiveSelectionIndeterminate?: boolean
  onApply?: () => void
  onChangeField?: (value: IField | '') => void
  onChangeValue?: (name: string, value: unknown) => void
  onSelection?: (checked: boolean) => void
  selectedRows?: (string | number)[]
  withSelection?: boolean
}

function TableStickyBar(props: IProps): JSX.Element {
  const {
    field,
    fieldOptions,
    fieldValue,
    massiveSelectionState,
    massiveSelectionIndeterminate,
    onApply,
    onChangeField,
    onChangeValue,
    onSelection,
    selectedRows,
    withSelection,
  } = props
  const { t } = useTranslation('common')
  const { t: tApi } = useTranslation('api')
  const header = field ? getFieldHeader(field, tApi) : null

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    formIsValid: boolean
  ): void {
    event.preventDefault()
    if (!formIsValid) setShowError(true)
    else onApply()
  }

  function handleSelection(event: ChangeEvent<HTMLInputElement>): void {
    onSelection(event.target.checked)
  }

  function handleCancelSelection(): void {
    onSelection(false)
  }

  const [showError, setShowError] = useState(false)

  return (
    <Form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
      }}
    >
      {Boolean(withSelection) && (
        <Checkbox
          indeterminate={massiveSelectionIndeterminate}
          checked={massiveSelectionState}
          onChange={handleSelection}
        />
      )}
      {t('table.selected', { count: selectedRows.length })}
      <Dropdown
        onChange={onChangeField}
        options={fieldOptions}
        style={{ marginLeft: '32px', marginRight: '16px' }}
        value={field}
      />
      {field !== '' && (
        <FieldGuesser
          {...header}
          label=""
          onChange={onChangeValue}
          useDropdownBoolean
          value={fieldValue}
          showError={showError}
        />
      )}
      <ActionsButtonsContainer>
        <Button display="tertiary" onClick={handleCancelSelection}>
          {t('table.cancel')}
        </Button>
        <Button sx={{ marginLeft: 1 }} type="submit">
          {t('table.apply')}
        </Button>
      </ActionsButtonsContainer>
    </Form>
  )
}

export default TableStickyBar
