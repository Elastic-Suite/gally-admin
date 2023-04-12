import React, { useContext, useEffect } from 'react'
import { IField, IOptions, LoadStatus } from '@elastic-suite/gally-admin-shared'
import { optionsContext } from '../../../../src/contexts'
import { Box } from '@mui/material'

interface IProps {
  value: string | string[]
  field?: IField
  options?: IOptions<unknown>
  multipleSeparatorValue?: string
}

function ReadableDropDownGuesser(props: IProps): JSX.Element {
  const { value, field, options, multipleSeparatorValue } = props

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

  if (value instanceof Array) {
    return (
      <div>
        {multipleSeparatorValue
          ? value.join(multipleSeparatorValue)
          : value.map((item) => {
              const val = newDropDownOptions[item] ?? item
              return <div key={val}>{val}</div>
            })}
      </div>
    )
  }
  return <Box>{newDropDownOptions[value as string] ?? (value as string)}</Box>
}

export default ReadableDropDownGuesser
