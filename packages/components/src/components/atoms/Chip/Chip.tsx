import React from 'react'
import { styled } from '@mui/system'
import { ChipProps, IconButton, Chip as MuiChip } from '@mui/material'

import IonIcon from '../IonIcon/IonIcon'
import { TestId, generateTestId } from '../../../utils/testIds'

const StyledChip = styled(MuiChip)(({ theme, disabled }) => ({
  display: 'inline-flex',
  height: '26px',
  color: theme.palette.colors.neutral['900'],
  fontFamily: 'var(--gally-font)',
  fontWeight: disabled ? 400 : 600,
  fontSize: disabled ? 14 : 12,
  lineHeight: '18px',
  textAlign: 'center',
  alignItems: 'center',
  padding: `2px ${theme.spacing(1)}`,
  background: theme.palette.colors.neutral['300'],
  borderRadius: '13px',
  cursor: 'default',
  '&.MuiChip-colorPrimary': {
    color: theme.palette.colors.secondary['600'],
    background: theme.palette.colors.secondary['100'],
  },
  '&.MuiChip-colorSuccess': {
    color: theme.palette.success.main,
    background: theme.palette.success.light,
  },
  '&.MuiChip-colorWarning': {
    color: theme.palette.warning.main,
    background: theme.palette.warning.light,
  },
  '&.MuiChip-colorError': {
    color: theme.palette.error.main,
    background: theme.palette.error.light,
  },
  '&.MuiChip-sizeSmall': {
    height: '20px',
  },
  '& .MuiChip-label': {
    padding: 0,
  },
  '& .MuiChip-deleteIcon': {
    color: 'inherit',
    margin: `0 0 0 ${theme.spacing(0.5)}`,
    padding: 0,
    fontSize: '14px',
    '&:hover': {
      color: 'inherit',
      opacity: 0.5,
    },
  },
}))
interface IChipProps extends ChipProps {
  componentId?: string
}
function Chip(props: IChipProps): JSX.Element {
  const { disabled, componentId } = props

  const dataTestId = generateTestId(TestId.CHIP, componentId)
  return (
    <StyledChip
      disabled={disabled}
      data-testid={dataTestId}
      {...props}
      style={{ opacity: 1 }}
      deleteIcon={
        <IconButton>
          <IonIcon
            name="close"
            componentId={generateTestId(TestId.CHIP_DELETE_ICON, dataTestId)}
          />
        </IconButton>
      }
    />
  )
}

export default Chip
