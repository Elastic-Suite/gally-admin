import { ITabContentProps } from '@elastic-suite/gally-admin-shared'
import React, { PropsWithChildren, SyntheticEvent, createContext } from 'react'
import {
  ColumnContainer,
  RowContainer,
} from './FiltersPreviewBoostingTab.styled'
import Button from '../../atoms/buttons/Button'
import { useFormValidation } from '../../../hooks'
export interface IPropsFiltersPreviewBoostingTab
  extends PropsWithChildren,
    ITabContentProps {
  onSearch?: (formIsValid: boolean) => void
}
export const FormIsValidContext = createContext(false)
function FiltersPreviewBoostingTab({
  onSearch,
  children,
}: IPropsFiltersPreviewBoostingTab): JSX.Element {
  const { formRef, formIsValid } = useFormValidation()

  return (
    <ColumnContainer>
      <FormIsValidContext.Provider value={formIsValid}>
        <RowContainer
          ref={formRef}
          onSubmit={(event: SyntheticEvent): void => {
            event.preventDefault()
            onSearch(formIsValid)
          }}
        >
          {children}
          <Button
            sx={{ marginTop: '24px' }}
            onClick={(): void => onSearch(formIsValid)}
          >
            Rechercher
          </Button>
        </RowContainer>
      </FormIsValidContext.Provider>
    </ColumnContainer>
  )
}

export default FiltersPreviewBoostingTab
