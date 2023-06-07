import React from 'react'
import { PageTitle } from '../../../components'
import Button from '../../../components/atoms/buttons/Button'
import ResourceTable, {
  IResourceTable,
} from '../../../components/stateful-pages/ResourceTable/ResourceTable'
import { useFilters, useResource } from '../../../hooks'
import { useTranslation } from 'next-i18next'

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
  const { t } = useTranslation('common')

  return (
    <>
      <PageTitle title={title ?? resourceName}>
        {hasNewLink ? (
          <Button>
            <a style={{ textDecoration: 'none' }} href={newLink ?? './create'}>
              {t('create')} {title ?? resourceName}
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
