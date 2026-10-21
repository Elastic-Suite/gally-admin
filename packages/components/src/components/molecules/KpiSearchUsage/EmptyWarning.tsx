import React, { useState } from 'react'
import { Trans } from 'next-i18next'

import Alert from '../../atoms/Alert/Alert'

interface IEmptyWarningProps {
  isKpiValuesEmpty: boolean
}

function EmptyWarning({ isKpiValuesEmpty }: IEmptyWarningProps): JSX.Element {
  const [showWarning, setShowWarning] = useState(true)

  if (!showWarning || !isKpiValuesEmpty) {
    return null
  }

  return (
    <Alert
      variant="warning"
      style={{ marginBottom: 0 }}
      onShut={(): void => setShowWarning(false)}
    >
      <Trans
        i18nKey="kpiValuesEmpty.warning"
        ns="searchUsage"
        components={{
          lnk: (
            <a
              href="https://github.com/Elastic-Suite/gally-admin/wiki/Getting-started-with-the-JS-SDK"
              target="_blank"
              rel="noreferrer"
            >
              {/* content injected by Trans */}
            </a>
          ),
        }}
      />
    </Alert>
  )
}

export default EmptyWarning
