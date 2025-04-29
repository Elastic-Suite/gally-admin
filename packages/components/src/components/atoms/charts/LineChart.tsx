import React from 'react'
import { LineChart as MuiLineChart } from '@mui/x-charts'
import {
  ChartContainer,
  CustomAxisTooltipContent,
  IChartContainerProps,
} from './chart'

interface ILineChartProps extends Omit<IChartContainerProps, 'children'> {
  data: {
    color?: string

    yPoints: number[]
  }[]
  xAxis: number[]
  xLabel?: string
  yLabel?: string
}

function LineChart({
  data,
  xLabel,
  yLabel,
  xAxis,
  ...containerProps
}: ILineChartProps): JSX.Element {
  return (
    <ChartContainer {...containerProps}>
      <MuiLineChart
        margin={{
          top: 20,
        }}
        xAxis={[
          {
            label: xLabel,
            data: xAxis,
          },
        ]}
        tooltip={{ trigger: 'axis', axisContent: CustomAxisTooltipContent }}
        yAxis={[{ label: yLabel }]}
        series={data.map(({ yPoints, color }) => ({
          data: yPoints,
          color,
          showMark: true,
        }))}
      />
    </ChartContainer>
  )
}

export default LineChart
