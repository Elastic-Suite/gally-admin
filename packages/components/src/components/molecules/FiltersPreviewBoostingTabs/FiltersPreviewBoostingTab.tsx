import { ITabContentProps } from '@elastic-suite/gally-admin-shared'
import React from 'react'
import { Container, EmptyMessage } from './FiltersPreviewBoostingTab.styled'

export interface IContainerProps extends ITabContentProps {
  emptyMessage?: string | null
  displayEmptyMessage: boolean
  input: JSX.Element
}

export default function FiltersPreviewBoostingTab({
  emptyMessage,
  displayEmptyMessage,
  input,
}: IContainerProps): JSX.Element {
  return (
    <Container displayEmptyMessage={displayEmptyMessage}>
      {Boolean(emptyMessage && displayEmptyMessage) && (
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      )}
      {input}
    </Container>
  )
}
