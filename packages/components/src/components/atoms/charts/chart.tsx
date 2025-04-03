import React, { PropsWithChildren } from 'react'
import { Container, CustomPaper, IChartSize, Marked } from './chart.styled'
import { ChartsAxisContentProps, ChartsItemContentProps } from '@mui/x-charts'
import InfoTooltip from '../form/InfoTooltip'

export interface IChartContainerProps extends IChartSize, PropsWithChildren {
  label: string
  infoTooltip?: string
}

export function ChartContainer({
  label,
  infoTooltip,
  children,
  ...chartContainerSize
}: IChartContainerProps): JSX.Element {
  return (
    <Container {...chartContainerSize}>
      <h6>
        {label} {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
      </h6>
      <div>{children}</div>
    </Container>
  )
}

export function CustomItemTooltipContent({
  itemData,
  series,
}: ChartsItemContentProps<any>): JSX.Element {
  return (
    <CustomPaper
      sx={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Marked color={series.data[itemData.dataIndex].color} />
      <p style={{ margin: 0 }}>
        {series.valueFormatter({
          value: series.data[itemData.dataIndex].value,
        })}{' '}
        {series.data[itemData.dataIndex].label}
      </p>
    </CustomPaper>
  )
}

export function CustomAxisTooltipContent(
  props: ChartsAxisContentProps
): JSX.Element | null {
  const { dataIndex, series, axis } = props
  if (dataIndex === null || dataIndex === undefined) return null
  return (
    <CustomPaper>
      <p className="axis-label">
        {axis.label} {axis.data?.[dataIndex]}
      </p>
      <div className="axis-content">
        {series.map(({ data, color, id }) => {
          return (
            <p key={id}>
              {color ? <Marked color={color} /> : null}

              {data[dataIndex]?.toString()}
            </p>
          )
        })}
      </div>
    </CustomPaper>
  )
}
