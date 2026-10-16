import React, { ReactNode } from 'react'
import { TooltipProps } from '@mui/material'

import Tooltip from '../modals/Tooltip'
import IonIcon from '../IonIcon/IonIcon'
import { TestId, generateTestId } from '../../../utils/testIds'

interface IProps {
  title: string | NonNullable<React.ReactNode>
  children?: ReactNode
  componentId?: string
  noStyle?: boolean
  withHTMLTitle?: boolean
  fallbackPlacements?: TooltipProps['placement'][]
}

function InfoTooltip({
  title,
  children,
  componentId,
  noStyle,
  withHTMLTitle,
  fallbackPlacements,
}: IProps): JSX.Element {
  return (
    <Tooltip
      PopperProps={
        fallbackPlacements
          ? {
              modifiers: [{ name: 'flip', options: { fallbackPlacements } }],
            }
          : undefined
      }
      title={
        typeof title === 'string' && withHTMLTitle ? (
          <span
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        ) : (
          title
        )
      }
      placement="right"
    >
      <span
        data-testid={
          componentId
            ? generateTestId(TestId.INFO_TOOLTIP, componentId)
            : undefined
        }
        style={{
          display: 'inline-block',
          paddingLeft: noStyle ? '' : '10px',
          marginBottom: noStyle ? '' : '-5px',
        }}
      >
        {children ? children : <IonIcon name="informationCircle" tooltip />}
      </span>
    </Tooltip>
  )
}

export default InfoTooltip
