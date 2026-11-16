import { styled } from '@mui/material'

export const BasedOnBehavioralDataContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

export const DataTypeContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  '& .MuiInputBase-root': {
    minWidth: '230px',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}))
