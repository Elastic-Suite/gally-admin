import React, { useContext, useEffect } from 'react'
import {
  IField,
  IMultipleValueFormat,
  IOptions,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'
import { optionsContext } from '../../../../src/contexts'
import { Box } from '@mui/material'
import FormatRowArray from '../../molecules/format/FormatRowArray'

interface IProps {
  value: string | string[]
  field?: IField
  options?: IOptions<unknown>
  multipleValueFormat?: IMultipleValueFormat
}

function ReadableDropDownGuesser(props: IProps): JSX.Element {
  const { value, field, options, multipleValueFormat } = props

  const { fieldOptions, load, statuses } = useContext(optionsContext)
  const dropDownOptions =
    options ?? fieldOptions.get(field.property['@id']) ?? []

  useEffect(() => {
    if (!options && field) {
      load(field)
    }
  }, [field, load, options])

  const newDropDownOptions = Object.fromEntries(
    dropDownOptions.map((it) => [it.value, it.label])
  )

  if (statuses.current.get(field.property['@id']) !== LoadStatus.SUCCEEDED) {
    return null
  }

  return value instanceof Array ? (
    <FormatRowArray
      values={value.map((item) => newDropDownOptions[item] ?? item)}
      multipleValueFormat={multipleValueFormat}
    />
  ) : (
    <Box>{newDropDownOptions[value as string] ?? (value as string)}</Box>
  )
}

export default ReadableDropDownGuesser
