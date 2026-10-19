import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { TestId, generateTestId } from '../../../utils/testIds'
import Button from '../../atoms/buttons/Button'
import { IKpiZeroResultTerm } from '../KpiLoader/KpiLoader'

import TermsTable from './TermsTable'
import { useWidgetId } from './widgetId'

const thesaurusGridUrl = '/admin/search/thesaurus/grid'

const zeroResultColumns: (keyof IKpiZeroResultTerm & string)[] = [
  'term',
  'sessionCount',
  'visitorCount',
]

function ZeroResultTable(): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const router = useRouter()
  const widgetId = useWidgetId('zeroResult')

  function handleCreateThesaurus(): void {
    router.push(thesaurusGridUrl)
  }

  return (
    <TermsTable<IKpiZeroResultTerm>
      componentId={widgetId}
      endpoint="kpi/zero_result"
      title={t('zeroResultTable')}
      seeAllLabel={t('seeAllZeroResultTerms')}
      columns={zeroResultColumns}
    >
      <Button
        display="secondary"
        onClick={handleCreateThesaurus}
        data-testid={generateTestId(
          TestId.KPI_CREATE_THESAURUS_BUTTON,
          widgetId
        )}
      >
        {t('createThesaurus')}
      </Button>
    </TermsTable>
  )
}

export default ZeroResultTable
