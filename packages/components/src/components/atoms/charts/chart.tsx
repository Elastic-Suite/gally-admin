import React, { PropsWithChildren, ReactNode } from 'react'
import {
  Container,
  CustomPaper,
  EmptyMessage,
  IChartSize,
  Marked,
} from './chart.styled'
import { ChartsAxisContentProps, ChartsItemContentProps } from '@mui/x-charts'
import InfoTooltip from '../form/InfoTooltip'
import { TestId, generateTestId } from '../../../utils/testIds'

export interface IChartContainerProps extends IChartSize, PropsWithChildren {
  label: string
  infoTooltip?: ReactNode
  // Suffix of the chart's test id, and of its help icon's.
  componentId?: string
  // Shown instead of the chart when there is nothing to draw.
  emptyMessage?: string
}

export function ChartContainer({
  label,
  infoTooltip,
  componentId,
  emptyMessage,
  children,
  ...chartContainerSize
}: IChartContainerProps): JSX.Element {
  return (
    <Container
      data-testid={generateTestId(TestId.CHART, componentId)}
      {...chartContainerSize}
    >
      <h6>
        {label}{' '}
        {infoTooltip ? (
          <InfoTooltip title={infoTooltip} componentId={componentId} />
        ) : null}
      </h6>
      <div>
        {emptyMessage ? (
          <EmptyMessage
            data-testid={generateTestId(TestId.NO_DATA, componentId)}
          >
            {emptyMessage}
          </EmptyMessage>
        ) : (
          children
        )}
      </div>
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
