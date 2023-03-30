import React, { useContext, useEffect } from 'react'
import { IField, IOptions, LoadStatus } from '@elastic-suite/gally-admin-shared'
import { optionsContext } from '../../../../src/contexts'
import { Box } from '@mui/material'

interface IProps {
  value: string | string[]
  field?: IField
  options?: any
}

function ReadableDropDownGuesser(props: IProps): JSX.Element {
  const { value, field, options } = props

  const { fieldOptions, load, statuses } = useContext(optionsContext)
  //   console.log('fieldOptions', fieldOptions)
  const dropDownOptions: IOptions<unknown> =
    options ?? fieldOptions.get(field.property['@id']) ?? []

  useEffect(() => {
    if (!options && field) {
      load(field)
    }
  }, [field, load, options])

  if (statuses.current.get(field.property['@id']) === LoadStatus.SUCCEEDED) {
    // console.log('dropDownOptions', dropDownOptions)
    // console.log('value', value)

    if (Array.isArray(value)) {
      //   console.log('valueARRAY', value)

      return (
        <div>
          {(value as string[]).map((item) => {
            const val =
              dropDownOptions.find((val) => val?.value === item)?.label ?? item
            return <div key={val}>{val}</div>
          })}
        </div>
      )
    }
    return (
      <>
        {dropDownOptions.find((val) => val?.value === value)?.label ??
          (value as string)}
      </>
    )
  }
}

export default ReadableDropDownGuesser
