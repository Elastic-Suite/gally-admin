import React from 'react'
import { useTranslation } from 'next-i18next'

import { IKpiPopularSearchTerm } from '../KpiLoader/KpiLoader'

import TermsTable from './TermsTable'
import { useWidgetId } from './widgetId'

const popularSearchTermsColumns: (keyof IKpiPopularSearchTerm & string)[] = [
  'term',
  'sessionCount',
  'visitorCount',
  'averageResultCount',
  'conversionRate',
]

function PopularSearchTermsTable(): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const widgetId = useWidgetId('popularSearchTerms')

  return (
    <TermsTable<IKpiPopularSearchTerm>
      componentId={widgetId}
      endpoint="kpi/popular_search_terms"
      title={t('popularSearchTermsTable')}
      seeAllLabel={t('seeAllPopularSearchTerms')}
      columns={popularSearchTermsColumns}
    />
  )
}

export default PopularSearchTermsTable
