import React from 'react'
import { PieChart as MuiPieChart, legendClasses } from '@mui/x-charts'
import {
  ChartContainer,
  CustomItemTooltipContent,
  IChartContainerProps,
} from './chart'

interface IPieChartProps extends Omit<IChartContainerProps, 'children'> {
  data: {
    label: string
    value: number
    color: string
  }[]
}

function PieChart({ data, ...containerProps }: IPieChartProps): JSX.Element {
  return (
    <ChartContainer {...containerProps}>
      <MuiPieChart
        series={[
          {
            data,
            innerRadius: 80,
            outerRadius: 100,
            arcLabel: ({ value }) => `${value} %`,
            arcLabelRadius: 140,
            highlightScope: { faded: 'global', highlighted: 'item' },
            valueFormatter: ({ value }) => `${value}%`,

            cx: 150,
            cy: 100,
          },
        ]}
        sx={{
          marginLeft: 0,
          fontFamily: 'var(--gally-font)',
          [`& .${legendClasses.mark}`]: {
            ry: 10,
          },
        }}
        tooltip={{
          trigger: 'item',
          itemContent: CustomItemTooltipContent,
        }}
        slotProps={{
          legend: {
            position: {
              vertical: 'bottom',
              horizontal: 'right',
            },
          },
        }}
      />
    </ChartContainer>
  )
}

export default PieChart
