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

const innerRadius = 80
const outerRadius = 100
const arcLabelRadius = 145
// Room around the arc labels, so a label such as "42.86 %" on the left or at
// the top is not cut off by the edge of the drawing area.
const labelSpace = { horizontal: 55, vertical: 20 }

// Height that fits the pie and its labels.
export const pieChartHeight = 2 * (arcLabelRadius + labelSpace.vertical)

function PieChart({ data, ...containerProps }: IPieChartProps): JSX.Element {
  return (
    <ChartContainer height={pieChartHeight} {...containerProps}>
      <MuiPieChart
        margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
        series={[
          {
            data,
            innerRadius,
            outerRadius,
            arcLabel: ({ value }) => `${value} %`,
            arcLabelRadius,
            highlightScope: { faded: 'global', highlighted: 'item' },
            valueFormatter: ({ value }) => `${value}%`,

            cx: arcLabelRadius + labelSpace.horizontal,
            cy: arcLabelRadius + labelSpace.vertical,
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
