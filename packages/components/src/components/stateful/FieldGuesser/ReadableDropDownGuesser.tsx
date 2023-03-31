import React, { useContext, useEffect } from 'react'
import { IField, IOptions, LoadStatus } from '@elastic-suite/gally-admin-shared'
import { optionsContext } from '../../../../src/contexts'
import { Box } from '@mui/material'

interface IProps {
  value: string | string[]
  field?: IField
  options?: IOptions<unknown>
}

function ReadableDropDownGuesser(props: IProps): JSX.Element {
  const { value, field, options } = props

  const { fieldOptions, load, statuses } = useContext(optionsContext)
  const dropDownOptions =
    options ?? fieldOptions.get(field.property['@id']) ?? []

  useEffect(() => {
    if (!options && field) {
      load(field)
    }
  }, [field, load, options])

  const newDropDownOptions = Object.fromEntries(
    dropDownOptions.map((it) => [it.id ?? it.value, it.label])
  )

  if (statuses.current.get(field.property['@id']) === LoadStatus.SUCCEEDED) {
    if (Array.isArray(value)) {
      return (
        <Box>
          {(value as string[]).map((item) => {
            const val = newDropDownOptions[item] ?? item
            return <div key={val}>{val}</div>
          })}
        </Box>
      )
    }
    return <Box>{newDropDownOptions[value as string] ?? (value as string)}</Box>
  }
}

export default ReadableDropDownGuesser
