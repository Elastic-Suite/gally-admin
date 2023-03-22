import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { withAuth, withOptions } from '../../../hocs'
import { breadcrumbContext } from '../../../contexts'
import PageTitle from '../../../components/atoms/PageTitle/PageTitle'
import Button from '../../../components/atoms/buttons/Button'
import { useFilters, useResource } from '../../../hooks'
import { ResourceTable } from '../../../components'

const pagesSlug = ['boost', 'grid']

// const fixedFilters = { 'metadata.entity': 'product' }
const fixedFilters = { 'metadata.entity': 'product' }

function AdminBoostGrid(): JSX.Element {
  const router = useRouter()

  const [, setBreadcrumb] = useContext(breadcrumbContext)
  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const resource = useResource('SourceField')
  const ressourceBoost = useResource('Boost')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [activeFiltersBoost, setActiveFiltersBoost] = useFilters(ressourceBoost)

  // console.log('ressourceSourceField', resource)
  // console.log('ressourceBoost', ressourceBoost)
  // console.log('activeFilters', activeFilters)
  // console.log('activeFiltersBoost', activeFiltersBoost)

  // todo: temporary page
  return (
    <>
      <PageTitle title="Boost">
        <Button>Créer un nouveau boost</Button>
      </PageTitle>
      <ResourceTable
        active={true}
        activeFilters={activeFiltersBoost}
        filters={fixedFilters}
        resourceName="Boost"
        setActiveFilters={setActiveFiltersBoost}
        showSearch
      />
    </>
  )
}

export default withAuth(withOptions(AdminBoostGrid))
