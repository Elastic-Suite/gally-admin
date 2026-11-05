import React from 'react'
import { IOptions } from '@elastic-suite/gally-admin-shared'
import { useTranslation } from 'next-i18next'
import DropDown from '../../atoms/form/DropDown'
import InputText from '../../atoms/form/InputText'
import Switch from '../../atoms/form/Switch'
import BoostImpactField from '../BoostImpact/BoostImpactField'
import {
  boostModels,
  getScaleFactorError,
  isBoostModelFieldRequired,
} from '../../../services/boostModel'
import {
  BasedOnBehavioralDataContainer,
  DataTypeContainer,
} from './BasedOnBehavioralData.styled'

export interface IBasedOnBehavioralDataValueDataType {
  metric: string
  timeframe: string
  calculation: string
}

export interface IBasedOnBehavioralDataValue {
  data_type: IBasedOnBehavioralDataValueDataType
  boost_impact?: string
  scale_factor: number
  allow_negative_boost: boolean
}

export interface IBasedOnBehavioralDataTypeOptions {
  metric: IOptions<string>
  timeframe: IOptions<string>
  calculation: IOptions<string>
}

export interface IBasedOnBehavioralDataProps {
  data_type: IBasedOnBehavioralDataTypeOptions
  boostImpactOptions: IOptions<string>
  value: IBasedOnBehavioralDataValue
  showError?: boolean
  required?: boolean
  onChange?: (value: IBasedOnBehavioralDataValue) => void
}

const dataTypeFields: (keyof IBasedOnBehavioralDataValueDataType)[] = [
  'metric',
  'timeframe',
  'calculation',
]

function BasedOnBehavioralData({
  data_type: dataTypeOptions,
  boostImpactOptions,
  value,
  showError,
  required,
  onChange,
}: IBasedOnBehavioralDataProps): JSX.Element {
  const { t } = useTranslation('boost')

  function isRequired(field: string): boolean {
    return (
      Boolean(required) &&
      isBoostModelFieldRequired(boostModels.behavioralData, field)
    )
  }
  const dataType = value?.data_type
  const options = dataTypeOptions

  function handleChange(
    name: keyof IBasedOnBehavioralDataValue,
    newValue: string | number | boolean
  ): void {
    if (onChange)
      onChange({
        ...value,
        [name]: newValue,
      })
  }

  function handleDataTypeChange(
    name: keyof IBasedOnBehavioralDataValueDataType,
    newValue: string
  ): void {
    if (onChange)
      onChange({
        ...value,
        data_type: { ...dataType, [name]: newValue },
      })
  }

  return (
    <BasedOnBehavioralDataContainer>
      <DataTypeContainer>
        {dataTypeFields.map((name) => (
          <DropDown
            key={name}
            options={options[name]}
            label={t(`boostConfig.behavioralData.${name}`)}
            placeholder={t(`boostConfig.behavioralData.${name}.placeholder`)}
            value={dataType?.[name]}
            onChange={(newValue: string): void =>
              handleDataTypeChange(name, newValue)
            }
            required={isRequired(`data_type.${name}`)}
            showError={showError}
          />
        ))}
      </DataTypeContainer>

      <BoostImpactField
        options={boostImpactOptions}
        value={value?.boost_impact}
        helpTextKey="boostConfig.boostImpactHelp.behavioralData.text"
        onChange={(newValue: string): void =>
          handleChange('boost_impact', newValue)
        }
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
        value={value?.scale_factor}
        onChange={(newValue: number): void =>
          handleChange('scale_factor', newValue)
        }
        showError={showError}
        infoTooltip={t('boostConfig.scaleFactorTooltip')}
      />

      <Switch
        label={t('boostConfig.allowNegativeBoost')}
        checked={value?.allow_negative_boost}
        onChange={(newValue: boolean): void =>
          handleChange('allow_negative_boost', newValue)
        }
        infoTooltip={t('boostConfig.allowNegativeBoostTooltip')}
      />
    </BasedOnBehavioralDataContainer>
  )
}

export default BasedOnBehavioralData
