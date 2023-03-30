import {
  IFieldGuesserProps,
  ISearchParameters,
  ITableConfig,
  ITableRow,
} from '@elastic-suite/gally-admin-shared'
import React, { FunctionComponent } from 'react'
import { PageTitle } from '../../../components'
import Button from '../../../components/atoms/buttons/Button'
import ResourceTable from '../../../components/stateful-pages/ResourceTable/ResourceTable'
import { useFilters, useResource } from '../../../hooks'

interface IProps {
  Field?: FunctionComponent<IFieldGuesserProps>
  active?: boolean
  diffDefaultValues?: boolean
  getTableConfigs?: (rows: ITableRow[]) => ITableConfig[]
  filters?: ISearchParameters
  isFacets?: boolean
  resourceName: string
  urlParams?: string
  showSearch?: boolean
  hasUpdateLink?: boolean
  updateLink?: string
  title?: string
  hasNewLink?: boolean
  newLink?: string
}

function Grid(props: IProps): JSX.Element {
  const { resourceName, title, newLink, hasNewLink, ...otherProps } = props

  const resource = useResource(resourceName)
  const [activeFilters, setActiveFilters] = useFilters(resource)

  return (
    <>
      <PageTitle title={title ?? resourceName}>
        {hasNewLink && (
          <Button href={newLink ?? './new'}>
            Create new {title ?? resourceName}
          </Button>
        )}
      </PageTitle>

      <ResourceTable
        {...otherProps}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        resourceName={resourceName}
      />
    </>
  )
}

export default Grid
