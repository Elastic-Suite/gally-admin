import { Theme, styled } from '@mui/material'

interface IContainerProps {
  theme?: Theme
  displayEmptyMessage?: boolean
}

const containerProps = ['displayEmptyMessage']

export const Container = styled('div', {
  shouldForwardProp: (prop: string) => !containerProps.includes(prop),
})<IContainerProps>(({ displayEmptyMessage, theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
    ...(Boolean(!displayEmptyMessage) && {
      justifyContent: 'flex-start',
      alignItems: 'start',
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(0),
    }),
  }
})

export const EmptyMessage = styled('p')(({ theme }) => {
  return {
    width: '533px',
    color: 'var(--neutral-900, #151A47)',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '28px',
    margin: `0 0 ${theme.spacing(4)} 0`,
  }
})
