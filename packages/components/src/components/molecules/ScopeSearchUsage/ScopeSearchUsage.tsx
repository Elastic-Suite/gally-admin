import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { SectionFieldSet } from '../../organisms/CustomForm/CustomForm.styled'
import DoubleDatePicker from '../../atoms/form/DoubleDatePicker'
import DropDown from '../../atoms/form/DropDown'
import { IDoubleDatePickerValues } from '../../atoms/form/DoubleDatePickerWithoutError'
import { IOptions } from '@elastic-suite/gally-admin-shared'
import { ScopeSearchUsageForm } from './ScopeSearchUsage.styled'

interface IScopeSearchUsageProps {
  catalogsOptions: IOptions<string>
  onSubmit?: (value: {
    catalogs: string | string[]
    rangeDate: IDoubleDatePickerValues
  }) => void
}

function ScopeSearchUsage({
  catalogsOptions,
  onSubmit,
}: IScopeSearchUsageProps): JSX.Element {
  const [showErrors, setShowErrors] = useState(false)
  const [catalogValue, setCatalogValue] = useState<string | string[]>()
  const [rangeDateValue, setRangeDateValue] = useState<IDoubleDatePickerValues>(
    {
      fromDate: null,
      toDate: null,
    }
  )
  const { t } = useTranslation('searchUsage')

  function handleSubmit(
    e: React.SyntheticEvent<Element, Event>,
    formIsValid: boolean
  ): void {
    e.preventDefault()
    if (formIsValid && onSubmit) {
      onSubmit({
        catalogs: catalogValue!,
        rangeDate: rangeDateValue,
      })
    }
    setShowErrors(!formIsValid)
  }

  return (
    <SectionFieldSet style={{ padding: 16 }}>
      <ScopeSearchUsageForm
        submitButtonText={t('Apply') || ''}
        onSubmit={handleSubmit}
      >
        <DropDown
          sx={{ minWidth: '300px' }}
          label={t('Scope')}
          options={catalogsOptions}
          placeholder={t('Select a localized catalog') || ''}
          useGroups
          value={catalogValue}
          onChange={setCatalogValue}
          showError={showErrors}
          required
        />

        <DoubleDatePicker
          value={rangeDateValue}
          onChange={setRangeDateValue}
          showError={showErrors}
          required
        />
      </ScopeSearchUsageForm>
    </SectionFieldSet>
  )
}

export default ScopeSearchUsage
