import { styled } from '@mui/system'

export const CustomRootItem = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  fontFamily: 'var(--gally-font)',
  fontSize: theme.spacing(1.5),
  fontWeight: '600',
  lineHeight: '18px',
}))

const CustomPropError = ['error']
export const CustomRoot = styled(CustomRootItem, {
  shouldForwardProp: (prop: string) => !CustomPropError.includes(prop),
})<{ error: boolean }>(({ theme, error }) => ({
  padding: theme.spacing(2),
  background: theme.palette.colors.neutral[200],
  border: '1px solid',
  borderColor: error
    ? theme.palette.colors.primary[700]
    : theme.palette.colors.neutral[300],
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(0.5),
}))

const CustomProp = ['uniqueLine']
export const CustomFirstSelectedItem = styled('div', {
  shouldForwardProp: (prop: string) => !CustomProp.includes(prop),
})<{ uniqueLine: boolean }>(({ theme, uniqueLine }) => ({
  marginLeft: theme.spacing(5),
  marginTop: theme.spacing(4),
  position: 'relative',
  '::before': {
    content: "''",
    position: 'absolute',
    border: '1px dotted',
    height: '41px',
    width: '24px',
    borderRight: 'none',
    borderTop: 'none',
    top: '-32px',
    left: '-24px',
  },
  ...(!uniqueLine && {
    '::after': {
      content: "''",
      position: 'absolute',
      border: '1px dotted',
      height: `calc(100% + 30px)`,
      width: '24px',
      borderRight: 'none',
      borderTop: 'none',
      left: '-24px',
      top: '10px',
    },
  }),
}))

export const CustomSelectedItem = styled('div', {
  shouldForwardProp: (prop: string) => !CustomProp.includes(prop),
})<{ uniqueLine: boolean }>(({ theme, uniqueLine }) => ({
  marginLeft: theme.spacing(5),
  marginTop: theme.spacing(4),
  position: 'relative',
  ...(uniqueLine && {
    '::after': {
      content: "''",
      position: 'absolute',
      border: '1px dotted',
      height: `calc(100% + 33px)`,
      width: '24px',
      borderRight: 'none',
      borderTop: 'none',
      top: '9px',
      left: '-24px',
    },
  }),
}))
