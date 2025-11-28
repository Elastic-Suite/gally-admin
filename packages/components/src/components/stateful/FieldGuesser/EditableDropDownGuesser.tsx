import React, { SyntheticEvent, useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import {
  IFieldGuesserProps,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'

import { optionsContext } from '../../../contexts'

import DropDown from '../../atoms/form/DropDown'
import { useDropdownTextWidth } from '../../../hooks/useDropdownTextWidth'

interface IProps extends Omit<IFieldGuesserProps, 'onChange'> {
  onChange: (
    value: number | string | (number | string)[],
    event: SyntheticEvent
  ) => void
  useGroups?: boolean
  placeholder?: string
  error?: boolean
  helperText?: string
  helperIcon?: string
  componentId?: string
}

function EditableDropDownGuesser(props: IProps): JSX.Element {
  const {
    diffValue,
    disabled,
    field,
    label,
    multiple,
    onChange,
    options,
    required,
    value,
    useGroups,
    infoTooltip,
    placeholder,
    error,
    helperText,
    helperIcon,
    showError,
    replacementErrorsMessages,
    componentId,
    row,
  } = props

  const { t } = useTranslation('common')
  const { fieldOptions, load, statuses } = useContext(optionsContext)
  const dropDownOptions = useMemo(
    () => options ?? fieldOptions.get(field.property['@id']) ?? [],
    [options, fieldOptions, field]
  )
  const dirty = diffValue !== undefined && diffValue !== value
  const defaultMinWidth = 230.667
  const calculatedWidthFromHook = useDropdownTextWidth(
    dropDownOptions,
    defaultMinWidth,
    80
  )
  // In table context we try to keep the field as small as possible, in classic form it takes the default min width
  const calculatedWidth = row ? calculatedWidthFromHook : defaultMinWidth

  useEffect(() => {
    if (!options && field) {
      load(field)
    }
  }, [field, load, options])

  // Wait to load the options before rendering to avoid problems
  if (
    value &&
    dropDownOptions.length === 0 &&
    statuses.current.get(field.property['@id']) !== LoadStatus.SUCCEEDED
  ) {
    return null
  }

  return (
    <DropDown
      showError={showError}
      infoTooltip={infoTooltip}
      dirty={dirty}
      disabled={disabled}
      helperText={
        dirty
          ? t('form.defaultValue', {
              value: dropDownOptions.find(({ value }) => value === diffValue)
                ?.label,
            })
          : helperText
      }
      error={error}
      helperIcon={helperIcon}
      label={label}
      multiple={multiple}
      options={dropDownOptions}
      required={required}
      value={value}
      onChange={onChange}
      useGroups={useGroups}
      placeholder={
        value instanceof Array
          ? value?.length !== 0
            ? ''
            : placeholder
          : placeholder
      }
      objectKeyValue={field?.gally?.options?.objectKeyValue}
      sx={{ minWidth: calculatedWidth }}
      replacementErrorsMessages={replacementErrorsMessages}
      componentId={componentId}
    />
  )
}

export default EditableDropDownGuesser
