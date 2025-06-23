import Grid from '../Grid/Grid'
import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import { useTranslation } from 'next-i18next'

const propsButton = {
  endIcon: <ion-icon name="add-circle-outline" />,
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
      editLink='user/edit'
    />
  )
}

export default withAuth(withOptions(AdminUserGrid))
