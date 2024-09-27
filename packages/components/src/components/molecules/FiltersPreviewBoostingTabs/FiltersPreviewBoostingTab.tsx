import { ITabContentProps } from '@elastic-suite/gally-admin-shared'
import React, {
  PropsWithChildren,
  SyntheticEvent,
  createContext,
  useState,
} from 'react'
import Button from '../../atoms/buttons/Button'
import { useTranslation } from 'next-i18next'
import Form from '../../atoms/form/Form'
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
  const [formIsValid, setFormIsValid] = useState(false)

  const { t } = useTranslation('boost')
  function handleSubmit(e: SyntheticEvent, formIsValid: boolean): void {
    e.preventDefault()
    onSearch(formIsValid)
    setFormIsValid(formIsValid)
  }

  return (
    <FormIsValidContext.Provider value={formIsValid}>
      <Form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: '10px',
          flexDirection: 'row',
          alignItems: 'start',
        }}
      >
        {children}
        <Button sx={{ marginTop: '24px' }} type="submit">
          {t('preview')}
        </Button>
      </Form>
    </FormIsValidContext.Provider>
  )
}

export default FiltersPreviewBoostingTab
