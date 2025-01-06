import React, { ReactNode } from 'react'

import Tooltip from '../modals/Tooltip'
import IonIcon from '../IonIcon/IonIcon'

interface IProps {
  title: string | NonNullable<React.ReactNode>
  children?: ReactNode
  noStyle?: boolean
  withHTMLTitle?: boolean
}

function InfoTooltip({
  title,
  children,
  noStyle,
  withHTMLTitle,
}: IProps): JSX.Element {
  return (
    <Tooltip
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
