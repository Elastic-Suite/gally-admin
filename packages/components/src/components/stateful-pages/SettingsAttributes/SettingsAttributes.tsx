import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  ITabContentProps,
  ITableConfig,
  ITableRow,
} from '@elastic-suite/gally-admin-shared'

import { useFilters, useResource } from '../../../hooks'

import Alert from '../../atoms/Alert/Alert'

import ResourceTable from '../ResourceTable/ResourceTable'

const fixedFilters = { 'metadata.entity': 'product' }

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props

  const [
    isVisibleAlertSettingsAttributes,
    setIsVisibleAlertSettingsAttributes,
  ] = useState(true)

  const { t } = useTranslation('settings')

  const resource = useResource('SourceField')
  const [activeFilters, setActiveFilters] = useFilters(resource)

  function getTableConfigs(rows: ITableRow[]): ITableConfig[] {
    return rows.map((row) => ({
      isFilterable: { disabled: Boolean(row.isSystem) },
      isSearchable: { disabled: Boolean(row.isSystem) },
      selection: { disabled: Boolean(row.isSystem) },
      isSortable: { disabled: Boolean(row.isSystem) },
      isUsedForRules: { disabled: Boolean(row.isSystem) },
    }))
  }

  return (
    <>
      {Boolean(isVisibleAlertSettingsAttributes) && (
        <Alert
          message={t('settingsAttributes.alert')}
          onShut={(): void => setIsVisibleAlertSettingsAttributes(false)}
        />
      )}
      <ResourceTable
        active={active}
        activeFilters={activeFilters}
        filters={fixedFilters}
        getTableConfigs={getTableConfigs}
        resourceName="SourceField"
        setActiveFilters={setActiveFilters}
        showSearch
      />
    </>
  )
}

export default SettingsAttributes
