import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { IOptions } from '@elastic-suite/gally-admin-shared'
import CheckboxWithoutError from '../../atoms/form/CheckboxWithoutError'

// Chart geometry, in SVG units.
const width = 540
const height = 280
const left = 48
const right = 520
const top = 24
const bottom = 242
const samples = 60
const xTickCount = 10

export const metricRanges = [10, 100, 1000] as const
export type MetricRange = typeof metricRanges[number]

type CurveKey = 'low' | 'medium' | 'high'

const curves: { key: CurveKey; fn: (x: number) => number }[] = [
  { key: 'low', fn: (x) => Math.log10(1 + x) },
  { key: 'medium', fn: (x) => Math.sqrt(x) },
  { key: 'high', fn: (x) => x },
]

const curveKeyByFunction: Record<string, CurveKey> = {
  log1p: 'low',
  sqrt: 'medium',
  none: 'high',
}

function defaultVisibleCurves(range: MetricRange): Record<CurveKey, boolean> {
  return { low: true, medium: true, high: range <= 10 }
}

function getYTicks(maxValue: number): number[] {
  const rawStep = Math.max(maxValue, 1) / 8
  const power = 10 ** Math.floor(Math.log10(rawStep))
  const step =
    [1, 2, 5, 10].map((factor) => factor * power).find((s) => s >= rawStep) ??
    10 * power
  const top = Math.ceil(maxValue / step) * step || step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
}

function formatTick(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

const Toolbar = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px 32px',
  alignSelf: 'stretch',
  marginBottom: '16px',
})

const Group = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '4px 12px',
})

const GroupLabel = styled('span')({
  fontSize: '12px',
  fontWeight: 600,
})

const Segments = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  borderRadius: '8px',
  overflow: 'hidden',
}))

const Segment = styled('button')(({ theme }) => ({
  border: 'none',
  padding: '4px 10px',
  fontSize: '12px',
  fontFamily: 'inherit',
  cursor: 'pointer',
  background: 'transparent',
  color: theme.palette.colors.neutral[800],
  '& + &': {
    borderLeft: `1px solid ${theme.palette.colors.neutral[300]}`,
  },
  '&:hover': {
    background: theme.palette.colors.neutral[200],
  },
  '&[aria-pressed="true"]': {
    background: theme.palette.secondary.main,
    color: theme.palette.colors.white,
  },
}))

// Gives each legend checkbox its curve's color when ticked.
const CurveToggle = styled('span')({
  '& .MuiCheckbox-root.Mui-checked': {
    color: 'var(--curve-color)',
  },
  '& .MuiCheckbox-root.Mui-checked .MuiTouchRipple-child': {
    backgroundColor: 'var(--curve-color)',
  },
})

const CurveLabel = styled('span')({
  fontWeight: 600,
})

const Note = styled('p')(({ theme }) => ({
  margin: '4px 0 0',
  alignSelf: 'stretch',
  fontSize: '12px',
  color: theme.palette.colors.neutral[600],
  // Hidden but still taking its space, so toggling it does not move the layout.
  '&[aria-hidden="true"]': {
    visibility: 'hidden',
  },
}))

interface IProps {
  options: IOptions<string>
}

function BoostImpactChart({ options }: IProps): JSX.Element {
  const { t } = useTranslation('boost')
  const labels: Record<CurveKey, string> = { low: '', medium: '', high: '' }
  options.forEach(({ value, label }) => {
    const key = curveKeyByFunction[value]
    if (key) {
      labels[key] = label
    }
  })
  const theme = useTheme()
  const [range, setRange] = useState<MetricRange>(10)
  const [visible, setVisible] = useState(defaultVisibleCurves(10))

  const colors: Record<CurveKey, string> = {
    low: theme.palette.colors.neutral[600],
    medium: theme.palette.colors.secondary[600],
    high: theme.palette.colors.primary[600],
  }
  const {
    300: gridColor,
    600: tickColor,
    900: textColor,
  } = theme.palette.colors.neutral

  const shownCurves = curves.filter(({ key }) => visible[key])
  const highHidden = range > 10 && !visible.high
  const yTicks = getYTicks(
    Math.max(0, ...shownCurves.map(({ fn }) => fn(range)))
  )
  const yMax = yTicks[yTicks.length - 1]
  const xTicks = Array.from(
    { length: xTickCount + 1 },
    (_, i) => (i * range) / xTickCount
  )

  function toX(value: number): number {
    return left + (value / range) * (right - left)
  }

  function toY(value: number): number {
    return bottom - (value / yMax) * (bottom - top)
  }

  function handleRangeChange(newRange: MetricRange): void {
    setRange(newRange)
    setVisible(defaultVisibleCurves(newRange))
  }

  return (
    <>
      <Toolbar>
        <Group role="group" aria-label={t('boostConfig.boostImpactHelp.range')}>
          <GroupLabel>{t('boostConfig.boostImpactHelp.range')}</GroupLabel>
          <Segments>
            {metricRanges.map((option) => (
              <Segment
                key={option}
                type="button"
                aria-pressed={option === range}
                onClick={(): void => handleRangeChange(option)}
              >
                0 - {option}
              </Segment>
            ))}
          </Segments>
        </Group>

        <Group>
          {curves.map(({ key }) => (
            <CurveToggle
              key={key}
              style={{ '--curve-color': colors[key] } as React.CSSProperties}
            >
              <CheckboxWithoutError
                small
                checked={visible[key]}
                onChange={(checked: boolean): void =>
                  setVisible((current) => ({ ...current, [key]: checked }))
                }
                label={
                  <CurveLabel style={{ color: colors[key] }}>
                    {labels[key]}
                  </CurveLabel>
                }
              />
            </CurveToggle>
          ))}
        </Group>
      </Toolbar>

      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={t('boostConfig.boostImpactHelp.graphLabel')}
        style={{ fontSize: '12px' }}
      >
        <text x={0} y={12} fill={textColor} fontWeight={600}>
          {t('boostConfig.boostImpactHelp.yAxis')}
        </text>

        {xTicks.map((tick) => (
          <g key={`x${tick}`}>
            <line
              x1={toX(tick)}
              x2={toX(tick)}
              y1={top}
              y2={bottom}
              stroke={gridColor}
            />
            <text
              x={toX(tick)}
              y={bottom + 18}
              textAnchor="middle"
              fill={tickColor}
            >
              {formatTick(tick)}
            </text>
          </g>
        ))}

        {yTicks.map((tick) => (
          <g key={`y${tick}`}>
            <line
              x1={left}
              x2={right}
              y1={toY(tick)}
              y2={toY(tick)}
              stroke={gridColor}
            />
            <text
              x={left - 10}
              y={toY(tick) + 4}
              textAnchor="end"
              fill={tickColor}
            >
              {formatTick(tick)}
            </text>
          </g>
        ))}

        {shownCurves.map(({ key, fn }) => (
          <g key={key}>
            <polyline
              points={Array.from({ length: samples + 1 }, (_, i) => {
                const x = (i * range) / samples
                return `${toX(x)},${toY(fn(x))}`
              }).join(' ')}
              fill="none"
              stroke={colors[key]}
              strokeWidth={1.5}
            />
            {xTicks.map((x) => (
              <circle
                key={x}
                cx={toX(x)}
                cy={toY(fn(x))}
                r={3}
                fill="#FFF"
                stroke={colors[key]}
                strokeWidth={1.5}
              />
            ))}
          </g>
        ))}

        <text
          x={right + 8}
          y={height - 2}
          textAnchor="end"
          fill={textColor}
          fontWeight={600}
        >
          {t('boostConfig.boostImpactHelp.xAxis')}
        </text>
      </svg>

      {/* Always rendered so its space stays reserved: hiding it must not move the layout. */}
      <Note aria-hidden={!highHidden}>
        {t('boostConfig.boostImpactHelp.highHidden', { label: labels.high })}
      </Note>
    </>
  )
}

export default BoostImpactChart
