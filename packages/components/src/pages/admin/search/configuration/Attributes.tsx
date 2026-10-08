import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { searchableAttributeUrl } from '@elastic-suite/gally-admin-shared'

import { breadcrumbContext, metadataContext } from '../../../../contexts'
import { withAuth, withOptions } from '../../../../hocs'
import { useFilters, useResource } from '../../../../hooks'

import Alert from '../../../../components/atoms/Alert/Alert'
import PageTitle from '../../../../components/atoms/PageTitle/PageTitle'
import ResourceTable from '../../../../components/stateful-pages/ResourceTable/ResourceTable'
import Metadata from '../../../../components/atoms/metadata/Metadata'
import JobButtons from '../../../../components/molecules/JobButtons/JobButtons'
import { styled } from '@mui/material'

const pagesSlug = ['search', 'configuration', 'attributes']
const importableExportableMetadata = ['product']

const StyledPageTitleWithJobButtons = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  '& > :first-of-type': {
    flex: 1,
  },
})

function AdminSearchFacetsConfigurationAttributes(): JSX.Element {
  const [isVisibleAlertAttributes, setIsVisibleAlertAttributes] = useState(true)

  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('attributes')

  const [fixedFilters, setFixedFilters] = useState<Record<string, string>>({
    'metadata.entity': 'product',
  })
  const isImportableExportableMetadata = importableExportableMetadata.includes(
    fixedFilters['metadata.entity']
  )

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const resource = useResource('SourceField')
  const [activeFilters, setActiveFilters] = useFilters(resource)

  const metadatas = useContext(metadataContext)

  if (!metadatas) {
    return null
  }

  return (
    <>
      <StyledPageTitleWithJobButtons>
        <PageTitle title={t(pagesSlug.at(-1))} sx={{ marginBottom: '32px' }} />
        {isImportableExportableMetadata && resource?.gally?.jobs ? (
          <div>
            <JobButtons
              resourceName="SourceField"
              jobButtons={resource.gally.jobs}
            />
          </div>
        ) : null}
      </StyledPageTitleWithJobButtons>
      {Boolean(isVisibleAlertAttributes) && (
        <Alert
          message={t('attributes.alert')}
          onShut={(): void => setIsVisibleAlertAttributes(false)}
        />
      )}
      <Metadata
        setFixedFilters={setFixedFilters}
        fixedFilters={fixedFilters['metadata.entity']}
        metadatas={metadatas}
      />
      <ResourceTable
        activeFilters={activeFilters}
        filters={fixedFilters}
        resourceName="SourceField"
        setActiveFilters={setActiveFilters}
        urlParams={searchableAttributeUrl}
        showSearch
        noAttributesProps={{
          title: t('attributes.none'),
          btnTitle: t('attributes.none.btn'),
          btnHref: 'admin/settings/attributes',
        }}
      />
    </>
  )
}

export default withAuth()(withOptions(AdminSearchFacetsConfigurationAttributes))
