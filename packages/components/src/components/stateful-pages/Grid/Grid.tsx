import React from 'react'
import { PageTitle } from '../../../components'
import Button from '../../../components/atoms/buttons/Button'
import ResourceTable, {
  IResourceTable,
} from '../../../components/stateful-pages/ResourceTable/ResourceTable'
import { useFilters, useResource } from '../../../hooks'

interface IProps
  extends Omit<IResourceTable, 'activeFilters' | 'setActiveFilters'> {
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
        {hasNewLink ? (
          <Button>
            <a style={{ textDecoration: 'none' }} href={newLink ?? './new'}>
              Create new {title ?? resourceName}
            </a>
          </Button>
        ) : null}
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
