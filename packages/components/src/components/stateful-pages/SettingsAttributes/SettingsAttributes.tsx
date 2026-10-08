import React, { useContext, useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  ITabContentProps,
  ITableConfig,
  ITableRow,
} from '@elastic-suite/gally-admin-shared'

import { useFilters, useResource } from '../../../hooks'

import Alert from '../../atoms/Alert/Alert'

import ResourceTable from '../ResourceTable/ResourceTable'

import Metadata from '../../atoms/metadata/Metadata'
import { metadataContext } from '../../../contexts'
import JobButtons from '../../molecules/JobButtons/JobButtons'
import { styled } from '@mui/material'

const StyledAlertWithJobButtonsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  minHeight: '50px',
}))

const StyledJobButtonsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginLeft: 'auto',
  flexShrink: 0,
}))

const importableExportableMetadata = ['product']

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props

  const [fixedFilters, setFixedFilters] = useState<Record<string, string>>({
    'metadata.entity': 'product',
  })
  const isImportableExportableMetadata = importableExportableMetadata.includes(
    fixedFilters['metadata.entity']
  )

  const [
    isVisibleAlertSettingsAttributes,
    setIsVisibleAlertSettingsAttributes,
  ] = useState(true)

  const { t } = useTranslation('settings')

  const resource = useResource('SourceField')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const hasJobButtons = Boolean(
    isImportableExportableMetadata && resource?.gally?.jobs
  )

  function getTableConfigs(rows: ITableRow[]): ITableConfig[] {
    return rows.map((row) => ({
      isFilterable: { disabled: Boolean(row.isSystem) },
      isSearchable: { disabled: Boolean(row.isSystem) },
      selection: { disabled: Boolean(row.isSystem) },
      isSortable: { disabled: Boolean(row.isSystem) },
      isUsedForRules: { disabled: Boolean(row.isSystem) },
      isUsedInAutocomplete: { disabled: Boolean(row.isSystem) },
    }))
  }

  const metadatas = useContext(metadataContext)

  if (!metadatas) {
    return null
  }

  return (
    <>
      {Boolean(isVisibleAlertSettingsAttributes || hasJobButtons) && (
        <StyledAlertWithJobButtonsContainer>
          {Boolean(isVisibleAlertSettingsAttributes) && (
            <Alert
              message={t('settingsAttributes.alert')}
              onShut={(): void => setIsVisibleAlertSettingsAttributes(false)}
              mb={0}
            />
          )}
          {hasJobButtons ? (
            <StyledJobButtonsContainer>
              <JobButtons
                resourceName="SourceField"
                jobButtons={resource.gally.jobs}
              />
            </StyledJobButtonsContainer>
          ) : null}
        </StyledAlertWithJobButtonsContainer>
      )}
      <Metadata
        setFixedFilters={setFixedFilters}
        fixedFilters={fixedFilters['metadata.entity']}
        metadatas={metadatas}
      />
      <ResourceTable
        active={active}
        activeFilters={activeFilters}
        filters={fixedFilters}
        getTableConfigs={getTableConfigs}
        resourceName="SourceField"
        setActiveFilters={setActiveFilters}
        showSearch
        noAttributesProps={{
          title: t('attributes.none'),
        }}
      />
    </>
  )
}

export default SettingsAttributes
