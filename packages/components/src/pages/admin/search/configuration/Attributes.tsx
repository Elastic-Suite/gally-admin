import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { searchableAttributeUrl } from '@elastic-suite/gally-admin-shared'

import { breadcrumbContext } from '../../../../contexts'
import { withAuth, withOptions } from '../../../../hocs'
import { useFilters, useResource } from '../../../../hooks'

import Alert from '../../../../components/atoms/Alert/Alert'
import PageTitle from '../../../../components/atoms/PageTitle/PageTitle'
import ResourceTable from '../../../../components/stateful-pages/ResourceTable/ResourceTable'

const pagesSlug = ['search', 'configuration', 'attributes']
const fixedFilters = { 'metadata.entity': 'product' }

function AdminSearchFacetsConfigurationAttributes(): JSX.Element {
  const [isVisibleAlertAttributes, setIsVisibleAlertAttributes] = useState(true)

  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('attributes')

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const resource = useResource('SourceField')
  const [activeFilters, setActiveFilters] = useFilters(resource)

  return (
    <>
      <PageTitle title={t(pagesSlug.at(-1))} sx={{ marginBottom: '32px' }} />
      {Boolean(isVisibleAlertAttributes) && (
        <Alert
          message={t('attributes.alert')}
          onShut={(): void => setIsVisibleAlertAttributes(false)}
        />
      )}
      <ResourceTable
        activeFilters={activeFilters}
        filters={fixedFilters}
        resourceName="SourceField"
        setActiveFilters={setActiveFilters}
        urlParams={searchableAttributeUrl}
        showSearch
      />
    </>
  )
}

export default withAuth(withOptions(AdminSearchFacetsConfigurationAttributes))
