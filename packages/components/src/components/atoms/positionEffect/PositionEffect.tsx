import React, { CSSProperties } from 'react'

import IonIcon from '../IonIcon/IonIcon'
import { TFunction, useTranslation } from 'next-i18next'
import {
  IPositionEffect,
  PositionEffectType,
} from '@elastic-suite/gally-admin-shared'

interface IProps {
  positionEffect: IPositionEffect
}
interface IPositionEffectDetails {
  iconName: string
  iconTitle: string
  style: CSSProperties
}

function getPositionDetails(
  type: PositionEffectType,
  t: TFunction
): IPositionEffectDetails {
  switch (type) {
    case 'up':
      return {
        iconName: 'arrow-up-outline',
        iconTitle: t('Up'),
        style: { color: '#18753C', backgroundColor: '#E7F4EC' },
      }
    case 'down':
      return {
        iconName: 'arrow-down-outline',
        iconTitle: t('Down'),
        style: { color: '#A02213', backgroundColor: '#FFE7E4' },
      }
    case 'straight':
      return {
        iconName: 'reorder-two-outline',
        iconTitle: t('Equal'),
        style: { color: '#424880', backgroundColor: '#E7E8FF' },
      }
  }
}

function PositionEffect(props: IProps): JSX.Element {
  const { positionEffect } = props

  const { t } = useTranslation('common')
  const positionDetails = getPositionDetails(positionEffect.type, t)

  return (
    <IonIcon
      name={positionDetails.iconName}
      title={positionDetails.iconTitle}
      style={{
        fontSize: '18px',
        padding: '5px',
        borderRadius: '50%',
        ...positionDetails.style,
      }}
    />
  )
}

export default PositionEffect
