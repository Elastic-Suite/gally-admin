import React from 'react'
import { useTranslation } from 'next-i18next'

import { useWidgetId } from '../../../hooks'
import { hasNoData } from '../../../services'
import { formatHelpText } from '../../../utils/helpText'
import BarChart from '../../atoms/charts/BarChart'
import { pieChartHeight } from '../../atoms/charts/PieChart'
import KpiLoader, { IKpiConversionRate } from '../KpiLoader/KpiLoader'

const conversionRateChartColors = {
  global: '#E57373',
  withSearch: '#1A1AFF',
  withoutSearch: '#FFCDD2',
}

function ConversionRateChart(): JSX.Element {
  const { t } = useTranslation('searchUsage')
  const widgetId = useWidgetId('conversionRate')

  return (
    <KpiLoader<IKpiConversionRate> endpoint="kpi/conversion_rate">
      {(result): JSX.Element => {
        const [kpi] = result.kpis
        // No session count in this response: all rates at 0 means no data.
        const isEmpty =
          hasNoData(result) ||
          (kpi &&
            kpi.globalConversionRate === 0 &&
            kpi.conversionRateWithSearch === 0 &&
            kpi.conversionRateWithoutSearch === 0)
        return (
          <BarChart
            componentId={widgetId}
            label={t('conversionRateChart')}
            infoTooltip={formatHelpText(kpi?.help)}
            emptyMessage={isEmpty ? t('noData') : undefined}
            height={pieChartHeight}
            data={[
              {
                label: t('globalConversionRate'),
                value: kpi?.globalConversionRate ?? 0,
                color: conversionRateChartColors.global,
              },
              {
                label: t('conversionRateWithSearch'),
                value: kpi?.conversionRateWithSearch ?? 0,
                color: conversionRateChartColors.withSearch,
              },
              {
                label: t('conversionRateWithoutSearch'),
                value: kpi?.conversionRateWithoutSearch ?? 0,
                color: conversionRateChartColors.withoutSearch,
              },
            ]}
          />
        )
      }}
    </KpiLoader>
  )
}

export default ConversionRateChart
