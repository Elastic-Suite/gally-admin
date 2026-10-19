import { Paper, Theme, styled } from '@mui/material'

import { Title } from '../SearchTermsTable/SearchTermsTable.styled'

export const StyledPaper = styled(Paper)(({ theme }) => ({
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  boxShadow: 'none',
  columnGap: theme.spacing(3),
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  rowGap: theme.spacing(6),
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(6),
}))

export const StyledContainer = styled('div')(() => ({
  marginBottom: '8px',
}))

export const StyledButtonContainer = styled('div')(() => ({
  marginTop: '25px',
}))

export const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  columnGap: theme.spacing(3),
  rowGap: theme.spacing(6),
  alignItems: 'flex-start',
  width: '100%',
}))

export type IndicatorSize = 'full' | 'twoThirds' | 'half' | 'third'

const indicatorColumns: Record<IndicatorSize, number> = {
  full: 6,
  twoThirds: 4,
  half: 3,
  third: 2,
}

export const StyledIndicatorGrid = styled('div', {
  shouldForwardProp: (prop) => prop !== 'level',
})<{ level: 'top' | 'cards' | 'inCard' }>(({ theme, level }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
  gap: theme.spacing(level === 'inCard' ? 4 : 3),
  marginTop: level === 'top' ? theme.spacing(6) : 0,
}))

function getIndicatorSpan(
  theme: Theme,
  size: IndicatorSize
): Record<string, unknown> {
  return {
    gridColumn: `span ${indicatorColumns[size]}`,
    minWidth: 0,
    [theme.breakpoints.down('md')]: {
      gridColumn: '1 / -1',
    },
  }
}

export const StyledTermsTableTitle = styled(Title)({ marginTop: 0 })

// A nested node: it only takes its place in the parent's grid.
export const StyledIndicatorCell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: IndicatorSize }>(({ theme, size }) => getIndicatorSpan(theme, size))

export const StyledIndicatorCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: IndicatorSize }>(({ theme, size }) => ({
  ...getIndicatorSpan(theme, size),
  border: `1px solid ${theme.palette.colors.neutral[300]}`,
  boxShadow: 'none',
  padding: theme.spacing(2),
}))

export const StyledTableActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}))

export const StyledNoData = styled('p')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(3, 2),
  border: '1px solid #E2E6F3',
  borderRadius: theme.spacing(1),
  textAlign: 'center',
  fontSize: '14px',
  fontFamily: 'var(--gally-font)',
  color: theme.palette.colors.neutral['600'],
}))

export const StyledPopinLoader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
})
