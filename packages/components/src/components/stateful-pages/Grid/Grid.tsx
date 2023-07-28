import React from 'react'
import { PageTitle } from '../../../components'
import Button from '../../../components/atoms/buttons/Button'
import ResourceTable, {
  IResourceTable,
} from '../../../components/stateful-pages/ResourceTable/ResourceTable'
import { useFilters, useResource } from '../../../hooks'
import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'

interface IProps
  extends Omit<IResourceTable, 'activeFilters' | 'setActiveFilters'> {
  title?: string
  hasNewLink?: boolean
  newLink?: string
  propsButton?: Record<string, any>
}

const isIconInButton = ['isIconInButton', 'large']
export const CustomAHref = styled('a', {
  shouldForwardProp: (prop: string) => !isIconInButton.includes(prop),
})<{ isIconInButton?: boolean; large?: boolean }>(
  ({ theme, isIconInButton, large }) => ({
    margin: large ? '-12px -24px' : '-8px -16px',
    padding: large ? '12px 24px' : '8px 16px',
    textDecoration: 'none',
    borderRadius: theme.spacing(1),
    ...(isIconInButton && {
      marginRight: large ? '-48px' : '-40px',
      paddingRight: large ? '48px' : '40px',
    }),
  })
)

function Grid(props: IProps): JSX.Element {
  const {
    resourceName,
    title,
    newLink,
    hasNewLink,
    propsButton,
    ...otherProps
  } = props

  const { t } = useTranslation('common')
  const resource = useResource(resourceName)
  const [activeFilters, setActiveFilters] = useFilters(resource)

  return (
    <>
      <PageTitle title={title ?? resourceName}>
        {hasNewLink ? (
          <Button {...propsButton}>
            {/* TODO endIcon={false} */}
            <CustomAHref
              href={newLink ?? './create'}
              isIconInButton={Boolean(propsButton.endIcon)} // TODO isIconInButton={false}
            >
              {t('create')} {title ?? resourceName}
            </CustomAHref>
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
