import dynamic from 'next/dynamic'

// Client only: @mui/x-charts ships an ESM build that Node cannot require,
// and next.config.js requires this whole bundle. So only the drawing waits
// for the browser: the chart frame, its title and its empty message still
// render on the server. Import @mui/x-charts here and nowhere else, except
// with "import type".
export const MuiPieChart = dynamic(
  () => import('@mui/x-charts').then((mod) => mod.PieChart),
  { ssr: false }
)

export const MuiBarChart = dynamic(
  () => import('@mui/x-charts').then((mod) => mod.BarChart),
  { ssr: false }
)

export const MuiLineChart = dynamic(
  () => import('@mui/x-charts').then((mod) => mod.LineChart),
  { ssr: false }
)

// Class names from @mui/x-charts 6, written out so that styling a chart
// does not load the library.
export const legendMarkClass = 'MuiChartsLegend-mark'
export const barElementRootClass = 'MuiBarElement-root'
export const tooltipLabelCellClass = 'MuiChartsTooltip-labelCell'
