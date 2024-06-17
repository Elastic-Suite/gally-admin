import { ITabContentProps } from '@elastic-suite/gally-admin-shared'
import React, { PropsWithChildren, createContext } from 'react'
import {
  ColumnContainer,
  RowContainer,
} from './FiltersPreviewBoostingTab.styled'
import Button from '../../atoms/buttons/Button'
import { useFormValidation } from '../../../hooks'
import { useTranslation } from 'next-i18next'
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
  const { t } = useTranslation('boost')
  return (
    <ColumnContainer>
      <FormIsValidContext.Provider value={formIsValid}>
        <RowContainer ref={formRef}>
          {children}
          <Button
            sx={{ marginTop: '24px' }}
            onClick={(): void => onSearch(formIsValid)}
          >
            {t('preview')}
          </Button>
        </RowContainer>
      </FormIsValidContext.Provider>
    </ColumnContainer>
  )
}

export default FiltersPreviewBoostingTab
