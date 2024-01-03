import { styled } from '@mui/material'

export const ColumnContainer = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'start',
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  }
})

export const RowContainer = styled('div')(() => {
  return {
    display: 'flex',
    gap: '10px',
    flexDirection: 'row',
    alignItems: 'start',
  }
})
