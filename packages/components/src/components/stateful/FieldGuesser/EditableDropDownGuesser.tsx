import React, { SyntheticEvent, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import {
  IFieldGuesserProps,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'

import { optionsContext } from '../../../contexts'

import DropDown from '../../atoms/form/DropDown'

interface IProps extends Omit<IFieldGuesserProps, 'onChange'> {
  onChange: (
    value: number | string | (number | string)[],
    event: SyntheticEvent
  ) => void
  useGroups?: boolean
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

  const modelOptions = [
    // to delete TODO
    {
      label: 'Constant score',
      value: 'constant_score',
    },
    {
      label: 'Behavioral Data',
      value: 'behavioral_data',
    },
  ]

  return (
    <DropDown
      infoTooltip={infoTooltip}
      dirty={dirty}
      disabled={disabled}
      helperText={
        Boolean(dirty) &&
        t('form.defaultValue', {
          value: dropDownOptions.find(({ value }) => value === diffValue)
            ?.label,
        })
      }
      label={label}
      multiple={multiple}
      options={label === 'Model' ? modelOptions : dropDownOptions}
      required={required}
      value={value}
      onChange={onChange}
      useGroups={useGroups}
    />
  )
}

export default EditableDropDownGuesser
