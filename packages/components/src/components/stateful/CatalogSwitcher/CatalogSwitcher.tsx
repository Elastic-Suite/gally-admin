import React, { useContext } from 'react'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import { IOptions } from 'gally-admin-shared'

import { catalogContext } from '../../../contexts'

import DropDown from '../../atoms/form/DropDown'

const SwitchersContainer = styled('div')({
  display: 'flex',
  columnGap: '8px',
  marginBottom: '8px',
})

function CatalogSwitcher(): JSX.Element {
  const { t } = useTranslation('categories')
  const {
    catalogId,
    catalogs: catalogsData,
    localizedCatalogId,
    setCatalogId,
    setLocalizedCatalogId,
  } = useContext(catalogContext)

  const catalogs: IOptions<number> = catalogsData
    ? [{ label: t('allCatalogs'), value: -1 }].concat(
        catalogsData.map((hydraMember) => ({
          label: hydraMember.name,
          value: hydraMember.id as number,
        }))
      )
    : [null]

  function localizedCatalogs(catalogId: number): IOptions<number> {
    return [
      {
        label: t('allLocales'),
        value: -1,
      },
    ].concat(
      catalogsData
        .filter((catalog) => catalog.id === catalogId)
        .map((catalog) =>
          catalog.localizedCatalogs.map((localizedCatalog) => ({
            label:
              localizedCatalog.localName[0].toUpperCase() +
              localizedCatalog.localName.substring(1),
            value: localizedCatalog.id as number,
          }))
        )
        .flat()
    )
  }

  function onCatalogChange(catalogId: number): void {
    setCatalogId(catalogId)
    setLocalizedCatalogId(-1)
  }

  function onLocalizedCatalogChange(localizedCatalogId: number): void {
    setLocalizedCatalogId(localizedCatalogId)
  }

  return (
    <SwitchersContainer>
      <DropDown
        style={{ fontSize: '12px' }}
        onChange={onCatalogChange}
        value={catalogId}
        options={catalogs}
        label={t('catalog.dropdown.label')}
      />
      {Boolean(catalogId) && catalogId !== -1 ? (
        <DropDown
          style={{ fontSize: '12px' }}
          onChange={onLocalizedCatalogChange}
          value={localizedCatalogId}
          options={localizedCatalogs(catalogId)}
          label={t('localizedCatalog.dropdown.label')}
        />
      ) : (
        <div style={{ width: 180 }} />
      )}
    </SwitchersContainer>
  )
}

export default CatalogSwitcher
