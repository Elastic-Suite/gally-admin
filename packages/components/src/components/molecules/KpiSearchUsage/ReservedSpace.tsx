import React, { ReactNode } from 'react'

interface IReservedSpaceProps {
  isLoading: boolean
  minHeight: number
  children: ReactNode
}

function ReservedSpace({
  isLoading,
  minHeight,
  children,
}: IReservedSpaceProps): JSX.Element {
  return <div style={isLoading ? { minHeight } : undefined}>{children}</div>
}

export default ReservedSpace
