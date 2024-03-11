import React from 'react'
import { Box } from '@mui/system'

import IonIcon from '../IonIcon/IonIcon'

interface IProps {
  type: 'up' | 'down' | 'straight'
  boostNumber?: number
  boostMultiplicator?: number
}
interface IBoostDetails {
  boostText: string
  boostColor: string
  boostTextColor: string
  boostIconName: string
}

function setBoostDetails(
  type: 'up' | 'down' | 'straight',
  boostNumber: number,
  boostMultiplicator: number
): IBoostDetails {
  switch (type) {
    case 'up':
      return {
        boostText: ` x${boostMultiplicator} ( ${boostNumber} boost) `,
        boostColor: 'success.light',
        boostTextColor: 'success.main',
        boostIconName: 'trending-up-outline',
      }
    case 'down':
      return {
        boostText: ` x${boostMultiplicator} ( ${boostNumber} boost) `,
        boostColor: 'error.light',
        boostTextColor: 'error.main',
        boostIconName: 'trending-down-outline',
      }
    case 'straight':
      return {
        boostText: 'no boost',
        boostColor: 'neutral.light',
        boostTextColor: 'colors.neutral.600',
        boostIconName: 'arrow-forward-outline',
      }
  }
}

function Boost(props: IProps): JSX.Element {
  const { type, boostNumber, boostMultiplicator } = props

  const boostDetail = setBoostDetails(type, boostNumber, boostMultiplicator)

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      <Box
        sx={{
          backgroundColor: boostDetail.boostColor,
          color: boostDetail.boostTextColor,
          height: '20px',
          width: '20px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IonIcon
          name={boostDetail.boostIconName}
          style={
            type === 'straight'
              ? { width: '14px', height: '14px' }
              : { width: '14px', height: '8px' }
          }
        />
      </Box>
      {boostNumber !== undefined && boostMultiplicator !== undefined && (
        <Box
          sx={{
            color: boostDetail.boostTextColor,
            fontFamily: 'var(--gally-font)',
            fontWeight: '500',
            fontSize: '12px',
            lineHeight: '18px',
          }}
        >
          {boostDetail.boostText}
        </Box>
      )}
    </Box>
  )
}

export default Boost
