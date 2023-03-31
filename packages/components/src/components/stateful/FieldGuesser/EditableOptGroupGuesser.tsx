import React, { SyntheticEvent, useContext, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import {
  IApiSchemaOptions,
  IField,
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
}

function convertValueForOpt(data: IApiSchemaOptions[]): IApiSchemaOptions[] {
  const convertedData: IApiSchemaOptions[] = []

  data.forEach((item) => {
    const { label, options } = item

    options.forEach((option) => {
      convertedData.push({
        id: label,
        value: option.value,
        label: option.label,
      })
    })
  })

  return convertedData
}

function EditableOptGroupGuesser(props: IProps): JSX.Element | null {
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
  } = props

  const { t } = useTranslation('common')
  const { fieldOptions, load, statuses } = useContext(optionsContext)
  const dropDownOptions =
    options ?? fieldOptions.get((field as IField).property['@id']) ?? []
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
    statuses.current.get((field as IField).property['@id']) !==
      LoadStatus.SUCCEEDED
  ) {
    return null
  }

  return (
    <DropDown
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
      options={
        convertValueForOpt(
          dropDownOptions as unknown as IApiSchemaOptions[]
        ) as IApiSchemaOptions[]
      }
      required={required}
      value={value as any}
      onChange={onChange}
      isOpt
    />
  )
}

export default EditableOptGroupGuesser
