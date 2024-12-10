import React, { SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import {
  DataContentType,
  IDependsForm,
  IExpansions,
  IFieldGuesserProps,
  IOption,
  IRequestType,
  IRuleCombination,
  ISynonyms,
} from '@elastic-suite/gally-admin-shared'

import DropDown from '../../atoms/form/DropDown'
import InputText from '../../atoms/form/InputText'
import Range from '../../atoms/form/Range'
import Switch from '../../atoms/form/Switch'

import ReadableFieldGuesser from './ReadableFieldGuesser'
import EditableDropDownGuesser from './EditableDropDownGuesser'
import MultipleInput from './MultipleInput'
import { IDoubleDatePickerValues } from '../../atoms/form/DoubleDatePickerWithoutError'
import DoubleDatePicker from '../../atoms/form/DoubleDatePicker'
import { Box } from '@mui/material'
import RequestTypeManager from '../../stateful/RequestTypeManager/RequestTypeManager'
import { isHiddenDepends } from '../../../services'
import RulesManager from '../RulesManager/RulesManager'
import Slider from '../../atoms/form/Slider'
import Synonym from '../../atoms/form/Synonym'
import Expansion from '../../atoms/form/Expansion'
import { IProportionalToAttributesValue } from '../../molecules/ProportionalToAttributes/ProportionalToAttributes'
import ProportionalToAttributesManager from '../../molecules/ProportionalToAttributes/ProportionalToAttributesManager'
function EditableFieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const {
    diffValue,
    input,
    disabled,
    label,
    multiple,
    name,
    onChange,
    options,
    useDropdownBoolean,
    value,
    required,
    showError,
    suffix,
    type,
    validation,
    depends,
    requestTypeConfigurations,
    data,
    optionConfig,
    infoTooltip,
    placeholder,
    error,
    helperText,
    replacementErrorsMessages,
  } = props

  const { t } = useTranslation('common')
  const dirty = Boolean(
    diffValue !== undefined &&
      ((diffValue !== null && diffValue !== value) ||
        (diffValue === null && Boolean(value?.toString())))
  )

  function handleChange(
    value:
      | boolean
      | number
      | string
      | (boolean | number | string)[]
      | IDoubleDatePickerValues
      | IRequestType
      | IRuleCombination
      | ISynonyms
      | IExpansions
      | IProportionalToAttributesValue,
    event?: SyntheticEvent
  ): void {
    if (onChange) {
      if (optionConfig) {
        return onChange(optionConfig as IOption<string>, value, event)
      }
      return onChange(name, value, event)
    }
  }

  if (depends) {
    const isHidden = isHiddenDepends(
      depends instanceof Array ? (depends as IDependsForm[]) : [depends],
      data
    )

    if (isHidden) {
      return null
    }
  }

  switch (input ?? type) {
    case DataContentType.NUMBER:
    case DataContentType.STRING: {
      return (
        <InputText
          infoTooltip={infoTooltip}
          dirty={dirty}
          disabled={disabled}
          error={error}
          helperText={
            dirty
              ? t('form.defaultValue', {
                  value: diffValue ? diffValue : t('default.undefined'),
                })
              : helperText
          }
          inputProps={validation}
          dataTestId={name}
          label={label}
          onChange={handleChange}
          required={required}
          showError={showError}
          suffix={suffix}
          type={input === DataContentType.NUMBER ? 'number' : 'text'}
          value={value as string | number | null}
          placeholder={placeholder}
          replacementErrorsMessages={replacementErrorsMessages}
        />
      )
    }

    case DataContentType.RANGE: {
      return (
        <Range
          infoTooltip={infoTooltip}
          dirty={dirty}
          disabled={disabled}
          helperText={
            dirty ? t('form.defaultValue', { value: diffValue }) : helperText
          }
          error={error}
          inputProps={validation}
          label={label}
          onChange={handleChange}
          required={required}
          showError={showError}
          suffix={suffix}
          value={value as (string | number | null)[]}
          replacementErrorsMessages={replacementErrorsMessages}
        />
      )
    }

    case DataContentType.SLIDER: {
      return (
        <Slider
          {...props}
          error={error}
          infoTooltip={infoTooltip}
          value={Number(value)}
          onChange={handleChange}
          helperText={helperText}
          dataTestId={name}
        />
      )
    }

    case DataContentType.RANGEDATE: {
      const {
        multipleInputConfiguration,
        multipleValueFormat,
        requestTypeConfigurations,
        ...doubleDatePickerProps
      } = props

      return (
        <Box>
          <DoubleDatePicker
            {...doubleDatePickerProps}
            placeholder={placeholder}
            infoTooltip={infoTooltip}
            value={value as IDoubleDatePickerValues}
            onChange={handleChange}
            error={error}
            helperText={helperText}
            label={label}
            dataTestId={name}
          />
        </Box>
      )
    }

    case DataContentType.RULEENGINE: {
      return (
        <RulesManager
          label={label}
          rule={value as string | IRuleCombination}
          active
          onChange={handleChange}
          first={false}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          showError={showError}
        />
      )
    }

    case DataContentType.REQUESTTYPE: {
      return (
        <RequestTypeManager
          data={data}
          infoTooltip={infoTooltip}
          requestTypeConfigurations={requestTypeConfigurations}
          value={value as IRequestType}
          onChange={handleChange}
          label={label}
          required={required}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          showError={showError}
          dataTestId={name}
        />
      )
    }
    case DataContentType.SYNONYM: {
      return (
        <Synonym
          infoTooltip={infoTooltip}
          value={value as ISynonyms}
          onChange={handleChange}
          label={label}
          required={required}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          showError={showError}
        />
      )
    }

    case DataContentType.EXPANSION: {
      return (
        <Expansion
          infoTooltip={infoTooltip}
          value={value as IExpansions}
          onChange={handleChange}
          label={label}
          required={required}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          showError={showError}
        />
      )
    }

    case DataContentType.MULTIPLEINPUT: {
      return (
        <MultipleInput
          {...props}
          infoTooltip={infoTooltip}
          value={value as string}
          onChange={handleChange}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
        />
      )
    }

    case DataContentType.OPTGROUP:
    case DataContentType.SELECT: {
      return (
        <EditableDropDownGuesser
          {...props}
          infoTooltip={infoTooltip}
          onChange={handleChange}
          useGroups={Boolean((input ?? type) === DataContentType.OPTGROUP)}
          multiple={Boolean(value instanceof Array)}
          error={error}
          helperText={helperText}
          replacementErrorsMessages={replacementErrorsMessages}
          dataTestId={name}
        />
      )
    }

    case DataContentType.BOOLEAN: {
      if (useDropdownBoolean) {
        return (
          <DropDown
            infoTooltip={infoTooltip}
            dirty={dirty}
            disabled={disabled}
            helperText={
              dirty ? t('form.defaultValue', { value: diffValue }) : helperText
            }
            label={label}
            multiple={multiple}
            options={
              options ?? [
                { label: t('filter.yes'), value: true },
                { label: t('filter.no'), value: false },
              ]
            }
            required={required}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            error={error}
            showError={showError}
            replacementErrorsMessages={replacementErrorsMessages}
          />
        )
      }
      return (
        <Switch
          infoTooltip={infoTooltip}
          checked={
            typeof value === 'string'
              ? JSON.parse(value as string)
              : Boolean(value)
          }
          disabled={disabled}
          helperText={
            Boolean(dirty) &&
            t('form.defaultValue', { value: t(`switch.${diffValue}`) })
          }
          onChange={handleChange}
          required={required}
          label={label}
          placeholder={placeholder}
          data-testid={name}
        />
      )
    }

    case DataContentType.PROPARTIONALTOATTRIBUTE: {
      return (
        <ProportionalToAttributesManager
          value={value as IProportionalToAttributesValue}
          onChange={handleChange}
          showError={showError}
        />
      )
    }

    default: {
      return <ReadableFieldGuesser {...props} infoTooltip={infoTooltip} />
    }
  }
}

export default EditableFieldGuesser
