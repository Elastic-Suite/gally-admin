import React from 'react'
import { withAuth, withOptions } from '../../../hocs'
import { useTranslation } from 'next-i18next'
import { Role } from '@elastic-suite/gally-admin-shared'

function AdminImport(): JSX.Element {
  const { t } = useTranslation('importexport')

  return (
    <>{ t('import') }</>
  )
}

export default withAuth(Role.ADMIN)(withOptions(AdminImport))
