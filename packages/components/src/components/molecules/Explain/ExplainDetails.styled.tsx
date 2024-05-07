import { styled } from '@mui/system'

export const ExplainDetailsStyled = styled('div')(({ theme }) => ({
  width: '100%',
  '& .header': {
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '28px',
    color: theme.palette.colors.neutral[900],
    '& h4': {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '30px',
      color: theme.palette.colors.neutral[900],
      margin: 0,
    },
  },
  '& h6': {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '24px',
    color: theme.palette.colors.neutral[900],
    margin: '0 0 8px 0',
    '& ion-icon': {
      fontSize: '16px',
      color: theme.palette.colors.neutral[500],
      '&:hover': {
        cursor: 'pointer',
      },
    },
    '&.collapse ion-icon': {
      fontSize: '18px',
      marginBottom: '-4px',
      float: 'right',
    },
  },
  '& .general-information': {
    margin: '24px 0 0 0',
    '& span': {
      display: 'block',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '20px',
      color: theme.palette.colors.neutral[600],
    },
  },
  '& .item': {
    margin: '48px 0 0 0',
  },
}))

export const AnalyzerLegends = styled('div')(({ theme }) => ({
  '& .header': {
    textAlign: 'center',
    margin: '0 0 24px 0',
    '& h4': {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '30px',
      color: theme.palette.colors.neutral[900],
      margin: 0,
    },
    '& ion-icon': {
      fontSize: '42px',
      color: theme.palette.colors.neutral[500],
    },
  },
  '& ul li ': {
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '28px',
    color: theme.palette.colors.neutral[900],
    margin: '0 0 16px 0',
    '& .field': {
      fontWeight: 900,
    },
  },
}))
