import React from 'react'
import RadioGroup from '../../atoms/form/RadioGroup'
import InputText from '../../atoms/form/InputText'
import DropDown from '../../atoms/form/DropDown'
import { styled } from '@mui/material'
import { IOptions } from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

export interface IProportionalToAttributesValue {
  sourceField?: string
  boostImpact?: string
  scaleFactor: number
}
export interface IProportionalToAttributesProps {
  sourceFields: IOptions<string>
  boostImpactOptions: IOptions<string>
  value: IProportionalToAttributesValue
  showError?: boolean
  onChange: (value: IProportionalToAttributesValue) => void
}

function ProportionalToAttributes({
  value,
  sourceFields,
  boostImpactOptions,
  showError,
  onChange,
}: IProportionalToAttributesProps): JSX.Element {
  const { sourceField, boostImpact, scaleFactor } = value
  const { t } = useTranslation('boost')

  function handleChange(
    name: keyof IProportionalToAttributesProps['value'],
    newValue: string | number
  ): void {
    onChange({
      ...value,
      [name]: newValue,
    })
  }

  return (
    <Container>
      <DropDown
        options={sourceFields}
        label={t('boostConfig.sourceField')}
        value={sourceField}
        onChange={(value: string): void => handleChange('sourceField', value)}
        required
        showError={showError}
        sx={{ minWidth: '230px' }}
        placeholder={t('boostConfig.sourceField.placeholder')}
      />

      <RadioGroup
        options={boostImpactOptions}
        defaultValue={boostImpact}
        onChange={(value: string): void => handleChange('boostImpact', value)}
        label={t('boostConfig.boostImpact')}
        required
        showError={showError}
      />

      <InputText
        type="number"
        label={t('boostConfig.scaleFactor')}
        required
        inputProps={{
          min: 0,
        }}
        value={scaleFactor}
        onChange={(value: number): void => handleChange('scaleFactor', value)}
        showError={showError}
      />
    </Container>
  )
}

export default ProportionalToAttributes
