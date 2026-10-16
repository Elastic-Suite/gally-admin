import React, { useCallback, useMemo } from 'react'
import type { ChartsAxisContentProps } from '@mui/x-charts'
import {
  ChartContainer,
  CustomAxisTooltipContent,
  IChartContainerProps,
} from './chart'
import {
  MuiBarChart,
  barElementRootClass,
  tooltipLabelCellClass,
} from './muiCharts'
import { SxProps, Theme } from '@mui/material'

interface IBarChartProps extends Omit<IChartContainerProps, 'children'> {
  data: {
    label: string
    value: number
    color: string
  }[]
}

export default function BarChart({
  data,
  ...containerProps
}: IBarChartProps): JSX.Element {
  const barColorStyles = useMemo(() => {
    const style: Record<string, SxProps<Theme>> = {}
    data.forEach(({ color }, index) => {
      style[`& .${barElementRootClass}:nth-child(${index + 1})` as string] = {
        fill: color,
      }
    })
    return style
  }, [data])

  const axisContent = useCallback(
    (props: ChartsAxisContentProps): JSX.Element | null => {
      if (props.dataIndex !== undefined && props.dataIndex !== null) {
        const { color } = data[props.dataIndex]
        props.series[0].color = color

        return <CustomAxisTooltipContent {...props} />
      }
      return null
    },
    [data]
  )

  return (
    <ChartContainer {...containerProps}>
      <MuiBarChart
        margin={{
          left: 30,
          right: 10,
          top: 20,
          bottom: 20,
        }}
        xAxis={[
          {
            id: 'categories',
            data: data.map((d) => d.label),
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: data.map((d) => d.value),
            color: '#E57373',
          },
        ]}
        tooltip={{
          trigger: 'axis',
          axisContent,
        }}
        sx={{
          ...barColorStyles,
          [`.MuiChartsAxis-tickLabel, .${tooltipLabelCellClass}`]: {
            fontFamily: 'var(--gally-font)',
          },
        }}
      />
    </ChartContainer>
  )
}
