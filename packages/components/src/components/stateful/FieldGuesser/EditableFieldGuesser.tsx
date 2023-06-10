import React, { SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import {
  DataContentType,
  IDependsForm,
  IFieldGuesserProps,
  IOption,
  IRequestType,
} from '@elastic-suite/gally-admin-shared'

import DropDown from '../../atoms/form/DropDown'
import InputTextError from '../../atoms/form/InputTextError'
import RangeError from '../../atoms/form/RangeError'
import Switch from '../../atoms/form/Switch'

import ReadableFieldGuesser from './ReadableFieldGuesser'
import EditableDropDownGuesser from './EditableDropDownGuesser'
import EditableModelConfig from './EditableModelConfig'
import DoubleDatePicker, {
  IDoubleDatePickerValues,
} from '../../atoms/form/DoubleDatePicker'

import { Box } from '@mui/material'
import RequestTypeManager from '../../stateful/RequestTypeManager/RequestTypeManager'
import { isHiddenDepends } from '../../../services'
import Slider from '../../atoms/form/Slider'

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
    categoriesList,
    data,
    optionConfig,
    infoTooltip,
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
      | IRequestType,
    event?: SyntheticEvent
  ): void {
    if (onChange) {
      if (optionConfig) {
        return onChange(optionConfig as IOption<string>, value, event)
      }
      if (name === 'doubleDatePicker') {
        const formatDate = {
          fromDate: (value as IDoubleDatePickerValues)?.from,
          toDate: (value as IDoubleDatePickerValues)?.to,
        }
        return onChange(name, formatDate, event)
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
        <InputTextError
          infoTooltip={infoTooltip}
          dirty={dirty}
          disabled={disabled}
          helperText={
            Boolean(dirty) &&
            t('form.defaultValue', {
              value: diffValue ? diffValue : t('default.undefined'),
            })
          }
          inputProps={validation}
          label={label}
          onChange={handleChange}
          required={required}
          showError={showError}
          suffix={suffix}
          type={input === DataContentType.NUMBER ? 'number' : 'text'}
          value={value as string | number | null}
        />
      )
    }

    case DataContentType.RANGE: {
      return (
        <RangeError
          infoTooltip={infoTooltip}
          dirty={dirty}
          disabled={disabled}
          helperText={
            Boolean(dirty) && t('form.defaultValue', { value: diffValue })
          }
          inputProps={validation}
          label={label}
          onChange={handleChange}
          required={required}
          showError={showError}
          suffix={suffix}
          value={value as (string | number | null)[]}
        />
      )
    }

    case DataContentType.SLIDER: {
      return (
        <Slider
          {...props}
          infoTooltip={infoTooltip}
          value={Number(value)}
          onChange={handleChange}
        />
      )
    }

    case DataContentType.RANGEDATE: {
      return (
        <Box>
          <DoubleDatePicker
            infoTooltip={infoTooltip}
            value={value as IDoubleDatePickerValues}
            onChange={handleChange}
          />
        </Box>
      )
    }

    case DataContentType.REQUESTTYPE: {
      return (
        <RequestTypeManager
          infoTooltip={infoTooltip}
          requestTypeConfigurations={requestTypeConfigurations}
          value={value as IRequestType}
          onChange={handleChange}
          label={label}
          required={required}
          categoriesList={categoriesList}
        />
      )
    }

    case DataContentType.MODELCONFIG: {
      return (
        <EditableModelConfig
          {...props}
          infoTooltip={infoTooltip}
          value={value as string}
          onChange={handleChange}
          label={label}
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
              Boolean(dirty) && t('form.defaultValue', { value: diffValue })
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
        />
      )
    }

    default: {
      return <ReadableFieldGuesser {...props} infoTooltip={infoTooltip} />
    }
  }
}

export default EditableFieldGuesser
