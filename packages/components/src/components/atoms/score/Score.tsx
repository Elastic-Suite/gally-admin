import React from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { BoostType, roundNumber } from '@elastic-suite/gally-admin-shared'

import Boost from '../boost/Boost'

interface IProps {
  scoreValue: number
  type?: BoostType
  boostNumber?: number
  boostMultiplicator?: number
  rounded?: boolean
}

const ScoreContainer = styled(Box)({
  display: 'block',
  fontWeight: '550',
  fontFamily: 'var(--gally-font)',
  fontSize: '16px',
  lineHeight: '24px',
  align: 'left',
  verticalAlign: 'center',
})

function Score(props: IProps): JSX.Element {
  const { rounded, scoreValue, type, boostNumber, boostMultiplicator } = props

  return (
    <Box>
      <ScoreContainer>
        {rounded ? roundNumber(scoreValue, 4) : scoreValue}
      </ScoreContainer>
      {Boolean(type) && (
        <Boost
          type={type}
          boostNumber={boostNumber}
          boostMultiplicator={boostMultiplicator}
        />
      )}
    </Box>
  )
}

export default Score
