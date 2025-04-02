import React from 'react'
import RadioGroup from '../../atoms/form/RadioGroup'
import InputText from '../../atoms/form/InputText'
import DropDown from '../../atoms/form/DropDown'
import { IOptions } from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'
import { ProportionalToAttributesContainer } from './ProportionalToAttributes.styled'
export interface IProportionalToAttributesValue {
  source_field_code?: string
  boost_impact?: string
  scale_factor: number
}

export interface IProportionalToAttributesProps {
  sourceFields: IOptions<string>
  boostImpactOptions: IOptions<string>
  value: IProportionalToAttributesValue
  showError?: boolean
  onChange?: (value: IProportionalToAttributesValue) => void
}

function ProportionalToAttributes({
  value,
  sourceFields,
  boostImpactOptions,
  showError,
  onChange,
}: IProportionalToAttributesProps): JSX.Element {
  const {
    source_field_code: sourceFieldCode,
    boost_impact: boostImpact,
    scale_factor: scaleFactor,
  } = value
  const { t } = useTranslation('boost')

  function handleChange(
    name: keyof IProportionalToAttributesValue,
    newValue: string | number
  ): void {
    if (onChange)
      onChange({
        ...value,
        [name]: newValue,
      })
  }

  return (
    <ProportionalToAttributesContainer>
      <DropDown
        options={sourceFields}
        label={t('boostConfig.sourceField')}
        value={sourceFieldCode}
        onChange={(value: string): void =>
          handleChange('source_field_code', value)
        }
        required
        showError={showError}
        sx={{ minWidth: '230px' }}
        placeholder={t('boostConfig.sourceField.placeholder')}
        fullWidth
      />

      <RadioGroup
        options={boostImpactOptions}
        value={boostImpact || null}
        onChange={(value: string): void => handleChange('boost_impact', value)}
        label={t('boostConfig.boostImpact')}
        required
        showError={showError}
      />

      <InputText
        type="number"
        label={t('boostConfig.scaleFactor')}
        required
        inputProps={{
          step: 'any',
          min: 0,
        }}
        additionalValidator={(value: number): string => {
          if (value <= 0) {
            return 'scaleFactorWrongFormat'
          }
          return ''
        }}
        value={scaleFactor}
        onChange={(value: number): void => handleChange('scale_factor', value)}
        showError={showError}
        infoTooltip={t('boostConfig.scaleFactorTooltip')}
      />
    </ProportionalToAttributesContainer>
  )
}

export default ProportionalToAttributes
