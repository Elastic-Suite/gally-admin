import { styled } from '@mui/system'
import { Paper } from '@mui/material'

export interface IChartSize {
  width?: number | string
  height?: number | string
}

export const Container = styled('div')<IChartSize>(
  ({ theme, width, height }) => ({
    '& > h6': {
      margin: 0,
      width: 'fit-content',
      marginBottom: theme.spacing(3),
      fontSize: '16px',
      fontFamily: 'var(--gally-font)',
      color: theme.palette.colors.neutral['900'],
    },
    '& > div ': {
      width: width || '100%',
      height: height || 400,
      color: theme.palette.colors.neutral['600'],
    },
  })
)

export const Marked = styled('span')<{ color: string }>(({ theme, color }) => ({
  width: theme.spacing(1),
  height: theme.spacing(1),
  borderRadius: '100%',
  backgroundColor: color,
  display: 'block',
  border: '3px solid white',
  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
}))

export const CustomPaper = styled(Paper)(({ theme }) => ({
  fontFamily: 'var(--gally-font)',
  color: theme.palette.colors.neutral['600'],
  '& .axis-label': {
    display: 'block',
    minWidth: 200,
    padding: theme.spacing(1),
    borderBottom: '1px solid #dcdddf',
    textAlign: 'center',
  },
  '& .axis-content': {
    padding: theme.spacing(2),
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    p: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(2),
      margin: 0,
    },
  },
}))
