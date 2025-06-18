import Grid from '../Grid/Grid'
import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import { useTranslation } from 'next-i18next'
import { Role } from '@elastic-suite/gally-admin-shared'

const propsButton = {
  endIcon: <ion-icon name="add-circle-outline" />,
  style: { marginBottom: '48px', marginLeft: 'auto' },
}

function AdminUserGrid(): JSX.Element {
  const { t } = useTranslation('user')

  return (
    <Grid
      resourceName="User"
      title={t('title.grid')}
      hasNewLink
      hasEditLink
      propsButton={propsButton}
      editLink="user/edit"
      hideTitle
    />
  )
}

export default withAuth(Role.ADMIN)(withOptions(AdminUserGrid))
