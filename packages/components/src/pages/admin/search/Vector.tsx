import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { breadcrumbContext, metadataContext } from '../../../contexts'
import { withAuth, withOptions } from '../../../hocs'
import { useFilters, useResource } from '../../../hooks'

import ResourceTable from '../../../components/stateful-pages/ResourceTable/ResourceTable'
import PageTitle from '../../../components/atoms/PageTitle/PageTitle'
import Alert from '../../../components/atoms/Alert/Alert'
import Metadata from '../../../components/atoms/metadata/Metadata'

const pagesSlug = ['search', 'vector']

function AdminSearchVector(): JSX.Element {
  const [isVisibleAlertAttributes, setIsVisibleAlertAttributes] = useState(true)

  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('attributes')

  const [fixedFilters, setFixedFilters] = useState<Record<string, string>>({
    'sourceField.metadata.entity': 'product',
  })

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const resource = useResource('VectorSearch')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const metadatas = useContext(metadataContext)

  if (!metadatas) {
    return null
  }

  return (
    <>
      <PageTitle title={t(pagesSlug.at(-1))} sx={{ marginBottom: '32px' }} />
      {Boolean(isVisibleAlertAttributes) && (
        <Alert
          message={t('attributes.alert')}
          onShut={(): void => setIsVisibleAlertAttributes(false)}
        />
      )}
      <Metadata
        setFixedFilters={setFixedFilters}
        fixedFilters={fixedFilters['sourceField.metadata.entity']}
        metadatas={metadatas}
      />
      <ResourceTable
        activeFilters={activeFilters}
        filters={fixedFilters}
        resourceName="VectorConfiguration"
        setActiveFilters={setActiveFilters}
        showSearch
      />
    </>
  )
}

export default withAuth(withOptions(AdminSearchVector))
