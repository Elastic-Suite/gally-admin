import { styled } from '@mui/system'

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: theme.spacing(8),
  rowGap: theme.spacing(14),
  width: '100%',
}))
