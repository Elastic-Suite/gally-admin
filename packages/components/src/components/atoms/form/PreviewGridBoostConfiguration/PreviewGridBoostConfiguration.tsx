import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import FiltersPreviewBoostingTabs, {
  IPreviewBoostFilter,
} from '../../../molecules/FiltersPreviewBoostingTabs/FiltersPreviewBoostingTabs'
import {
  ICategories,
  IJsonldBase,
  IOptions,
  IRequestTypesOptions,
  ProductRequestType,
  getIdFromIri,
} from '@elastic-suite/gally-admin-shared'
import { useFetchApi } from '../../../../hooks'
import { catalogContext } from '../../../../contexts'
import PreviewBoostingTableManager from '../../../organisms/PreviewBoostingTable/PreviewBoostingTableManager'
import { styled } from '@mui/material'
import { useTranslation } from 'next-i18next'

const RequiredMessage = styled('p')(() => ({
  color: 'var(--neutral-900, #151A47)',
  fontFamily: 'var(--gally-font)',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '28px',
}))

const defaultFilter: IPreviewBoostFilter = {
  type: ProductRequestType.CATALOG,
}

interface IPreviewGridBoostConfigurationProps {
  currentBoost: Record<string, unknown>
}

export default function PreviewGridBoostConfiguration({
  currentBoost,
}: IPreviewGridBoostConfigurationProps): JSX.Element {
  const { t } = useTranslation('boost')

  const [filter, setFilter] = useState<IPreviewBoostFilter>(defaultFilter)

  const [localizedCatalog, setLocalizedCatalog] = useState('')

  const categoriesParameters = useMemo(() => {
    return {
      localizedCatalogId: localizedCatalog,
    }
  }, [localizedCatalog])

  const [categoriesAPI] = useFetchApi<ICategories>(
    'categoryTree',
    categoriesParameters,
    undefined,
    true,
    filter.type === ProductRequestType.CATALOG
  )

  const [requestTypesOptionsAPI] = useFetchApi<
    {
      'hydra:member': IRequestTypesOptions[]
      'hydra:totalItems': number
    } & IJsonldBase
  >('boost_request_type_options')

  const { catalogs } = useContext(catalogContext)

  const requestTypes = useMemo(() => {
    const currentRequestTypes: string[] =
      (currentBoost?.requestTypes as [])?.map(
        ({ requestType }) => requestType
      ) || []

    return (
      requestTypesOptionsAPI?.data?.['hydra:member']?.filter((requestType) =>
        currentRequestTypes?.includes(requestType.value)
      ) || []
    )
  }, [currentBoost?.requestTypes, requestTypesOptionsAPI?.data])

  const localizedCatalogs: IOptions<string> = useMemo(() => {
    const localizedCatalogsId = (
      (currentBoost.localizedCatalogs as []) || []
    ).map((value: string) => getIdFromIri(value))
    return catalogs
      .map((hydraMember) => {
        return hydraMember.localizedCatalogs.map((localizedCatalog) => ({
          label: localizedCatalog.name,
          value: localizedCatalog.id.toString(),
          id: hydraMember.name,
        }))
      })
      .flat()
      .filter((localizedCatalogOption) =>
        localizedCatalogsId.includes(localizedCatalogOption.value)
      )
  }, [catalogs, currentBoost.localizedCatalogs])

  const boostIsValid = useMemo<boolean>(
    () =>
      Boolean((currentBoost?.requestTypes as [])?.length > 0) &&
      Boolean((currentBoost?.localizedCatalogs as [])?.length > 0) &&
      Boolean(currentBoost.model) &&
      Boolean(
        currentBoost.model !== 'attribute_value' ||
          (currentBoost.model === 'attribute_value' &&
            currentBoost.modelConfig &&
            Number(
              JSON.parse(currentBoost.modelConfig as string)
                ?.attribute_value_config?.scale_factor
            ) > 0)
      ),
    [
      currentBoost.localizedCatalogs,
      currentBoost.model,
      currentBoost.requestTypes,
      currentBoost.modelConfig,
    ]
  )

  const currentBoostPrevRef =
    useRef<IPreviewGridBoostConfigurationProps['currentBoost']>()
  useEffect(() => {
    currentBoostPrevRef.current = currentBoost
    setFilter(defaultFilter)
  }, [currentBoost])

  if (!boostIsValid) {
    return (
      <RequiredMessage data-testid="previewRequiredMessage">
        {t('missingRequiredFieldMessage')}
      </RequiredMessage>
    )
  }

  return (
    <>
      <FiltersPreviewBoostingTabs
        onSendFilter={setFilter}
        onLocalizedCatalogChange={setLocalizedCatalog}
        categories={categoriesAPI?.data?.categories || []}
        localizedCatalog={localizedCatalog}
        localizedCatalogsOptions={localizedCatalogs}
        requestTypes={requestTypes}
      />
      <PreviewBoostingTableManager
        filter={
          currentBoostPrevRef.current !== undefined &&
          currentBoostPrevRef.current !== currentBoost
            ? defaultFilter
            : filter
        }
        localizedCatalog={localizedCatalog}
        requestTypes={requestTypes}
        currentBoost={currentBoost}
      />
    </>
  )
}
