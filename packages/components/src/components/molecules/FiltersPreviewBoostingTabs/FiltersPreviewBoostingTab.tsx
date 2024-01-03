import { ITabContentProps } from '@elastic-suite/gally-admin-shared'
import React, { PropsWithChildren } from 'react'
import {
  ColumnContainer,
  RowContainer,
} from './FiltersPreviewBoostingTab.styled'
import Button from '../../atoms/buttons/Button'
export interface IPropsFiltersPreviewBoostingTab
  extends PropsWithChildren,
    ITabContentProps {
  buttonDisabled?: boolean
  onSearch?: () => void
}

export default function FiltersPreviewBoostingTab({
  buttonDisabled,
  onSearch,
  children,
}: IPropsFiltersPreviewBoostingTab): JSX.Element {
  return (
    <ColumnContainer>
      <RowContainer>
        {children}
        <Button
          sx={{ marginTop: '24px' }}
          disabled={buttonDisabled}
          onClick={onSearch}
        >
          Rechercher
        </Button>
      </RowContainer>
    </ColumnContainer>
  )
}
