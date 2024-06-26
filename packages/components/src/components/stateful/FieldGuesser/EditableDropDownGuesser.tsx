import React, { SyntheticEvent, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import {
  IFieldGuesserProps,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'

import { optionsContext } from '../../../contexts'

import DropDownError from '../../atoms/form/DropDownError'

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
  } = props

  const { t } = useTranslation('common')
  const { fieldOptions, load, statuses } = useContext(optionsContext)
  const dropDownOptions =
    options ?? fieldOptions.get(field.property['@id']) ?? []
  const dirty = diffValue !== undefined && diffValue !== value

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
    <DropDownError
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
      sx={{ minWidth: '230.667px' }}
      replacementErrorsMessages={replacementErrorsMessages}
    />
  )
}

export default EditableDropDownGuesser
