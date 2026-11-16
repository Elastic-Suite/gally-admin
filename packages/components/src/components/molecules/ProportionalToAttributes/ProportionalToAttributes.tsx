import React from 'react'
import InputText from '../../atoms/form/InputText'
import DropDown from '../../atoms/form/DropDown'
import Switch from '../../atoms/form/Switch'
import { IOptions } from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'
import BoostImpactField from '../BoostImpact/BoostImpactField'
import {
  boostModels,
  getScaleFactorError,
  isBoostModelFieldRequired,
} from '../../../services/boostModel'
import { ProportionalToAttributesContainer } from './ProportionalToAttributes.styled'
export interface IProportionalToAttributesValue {
  source_field_code?: string
  boost_impact?: string
  scale_factor: number
  allow_negative_boost: boolean
}

export interface IProportionalToAttributesProps {
  sourceFields: IOptions<string>
  boostImpactOptions: IOptions<string>
  value: IProportionalToAttributesValue
  showError?: boolean
  required?: boolean
  onChange?: (value: IProportionalToAttributesValue) => void
}

function ProportionalToAttributes({
  value,
  sourceFields,
  boostImpactOptions,
  showError,
  required,
  onChange,
}: IProportionalToAttributesProps): JSX.Element {
  const {
    source_field_code: sourceFieldCode,
    boost_impact: boostImpact,
    scale_factor: scaleFactor,
    allow_negative_boost: allowNegativeBoost,
  } = value
  const { t } = useTranslation('boost')

  function isRequired(field: string): boolean {
    return (
      Boolean(required) &&
      isBoostModelFieldRequired(boostModels.attributeValue, field)
    )
  }

  function handleChange(
    name: keyof IProportionalToAttributesValue,
    newValue: string | number | boolean
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
        required={isRequired('source_field_code')}
        showError={showError}
        sx={{ minWidth: '230px' }}
        placeholder={t('boostConfig.sourceField.placeholder')}
        fullWidth
      />

      <BoostImpactField
        options={boostImpactOptions}
        value={boostImpact}
        helpTextKey="boostConfig.boostImpactHelp.attributeValue.text"
        onChange={(value: string): void => handleChange('boost_impact', value)}
        showError={showError}
        required={isRequired('boost_impact')}
      />

      <InputText
        type="number"
        label={t('boostConfig.scaleFactor')}
        required={isRequired('scale_factor')}
        inputProps={{
          step: 'any',
          min: 0,
        }}
        additionalValidator={getScaleFactorError}
        value={scaleFactor}
        onChange={(value: number): void => handleChange('scale_factor', value)}
        showError={showError}
        infoTooltip={t('boostConfig.scaleFactorTooltip')}
      />

      <Switch
        label={t('boostConfig.allowNegativeBoost')}
        checked={allowNegativeBoost}
        onChange={(value: boolean): void =>
          handleChange('allow_negative_boost', value)
        }
        infoTooltip={t('boostConfig.allowNegativeBoostTooltip')}
      />
    </ProportionalToAttributesContainer>
  )
}

export default ProportionalToAttributes
