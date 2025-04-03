import React, { useCallback, useMemo } from 'react'
import {
  ChartsAxisContentProps,
  BarChart as MuiBarchart,
  barElementClasses,
  chartsTooltipClasses,
} from '@mui/x-charts'
import {
  ChartContainer,
  CustomAxisTooltipContent,
  IChartContainerProps,
} from './chart'
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
      style[`& .${barElementClasses.root}:nth-child(${index + 1})` as string] =
        {
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
      <MuiBarchart
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
          [`.MuiChartsAxis-tickLabel, .${chartsTooltipClasses.labelCell}`]: {
            fontFamily: 'var(--gally-font)',
          },
        }}
      />
    </ChartContainer>
  )
}
