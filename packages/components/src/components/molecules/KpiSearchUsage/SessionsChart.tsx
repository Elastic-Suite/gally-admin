import React from 'react'
import { useTranslation } from 'next-i18next'

import { useWidgetId } from '../../../hooks'
import { hasNoData } from '../../../services'
import { formatHelpText } from '../../../utils/helpText'
import PieChart from '../../atoms/charts/PieChart'
import KpiLoader, { IKpiSessions } from '../KpiLoader/KpiLoader'

const sessionsChartColors = {
  withSearch: '#2C19CD',
  withoutSearch: '#ED7465',
}

function SessionsChart(): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const widgetId = useWidgetId('sessions')

  return (
    <KpiLoader<IKpiSessions> endpoint="kpi/search_sessions">
      {(result): JSX.Element => {
        const [kpi] = result.kpis
        const isEmpty =
          hasNoData(result) ||
          (kpi &&
            kpi.sessionsWithSearchCount + kpi.sessionsWithoutSearchCount === 0)
        return (
          <PieChart
            componentId={widgetId}
            label={t('sessionsChart')}
            infoTooltip={formatHelpText(kpi?.help)}
            emptyMessage={isEmpty ? t('noData') : undefined}
            data={[
              {
                label: t('sessionsWithSearch'),
                value: kpi?.sessionsWithSearchPercentage ?? 0,
                color: sessionsChartColors.withSearch,
              },
              {
                label: t('sessionsWithoutSearch'),
                value: kpi?.sessionsWithoutSearchPercentage ?? 0,
                color: sessionsChartColors.withoutSearch,
              },
            ]}
          />
        )
      }}
    </KpiLoader>
  )
}

export default SessionsChart
