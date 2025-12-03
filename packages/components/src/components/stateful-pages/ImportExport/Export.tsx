import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import { useTranslation } from 'next-i18next'
import { Role } from '@elastic-suite/gally-admin-shared'

function AdminExport(): JSX.Element {
  const { t } = useTranslation('importexport')

  return (
    <>{ t('export') }</>
  )
}

export default withAuth(Role.ADMIN)(withOptions(AdminExport))
