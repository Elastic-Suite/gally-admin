import Grid from '../Grid/Grid'
import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import { useTranslation } from 'next-i18next'
import { ITabContentProps, Role } from '@elastic-suite/gally-admin-shared'
import IonIcon from '../../atoms/IonIcon/IonIcon'

const propsButton = {
  endIcon: <IonIcon name="add-circle-outline" />,
  style: { marginBottom: '48px', marginLeft: 'auto' },
}

function AdminUserGrid(props: ITabContentProps): JSX.Element {
  const { active } = props
  const { t } = useTranslation('user')

  return (
    <Grid
      active={active}
      resourceName="User"
      title={t('title.grid')}
      hasNewLink
      hasEditLink
      propsButton={propsButton}
      editLink="user/edit"
      hideTitle
      headTitle={null}
      newLink="./user/create"
    />
  )
}

export default withAuth(Role.ADMIN)(withOptions(AdminUserGrid))
