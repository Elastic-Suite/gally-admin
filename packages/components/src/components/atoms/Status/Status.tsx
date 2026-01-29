import Chip from '../Chip/Chip'
import { TestId, generateTestId } from '../../../utils/testIds'
import React, { useContext, useEffect } from 'react'
import { IField, IOptions, LoadStatus } from '@elastic-suite/gally-admin-shared'
import { optionsContext } from '../../../contexts'

interface IProps {
  value: string
  field?: IField
  options?: IOptions<unknown>
}

const jobStatusColorMap: Record<
  string,
  'success' | 'error' | 'warning' | 'info'
> = {
  finished: 'success',
  error: 'error',
  processing: 'info',
  pending: 'warning',
}

export default function Status(props: IProps): JSX.Element {
  const { value, field, options } = props

  const { fieldOptions, load, statuses } = useContext(optionsContext)
  const dropDownOptions =
    options ?? fieldOptions.get(field.property['@id']) ?? []

  useEffect(() => {
    if (!options && field) {
      load(field)
    }
  }, [field, load, options])

  if (statuses.current.get(field.property['@id']) !== LoadStatus.SUCCEEDED) {
    return null
  }

  const translatedValue = dropDownOptions.find((o) => o.value === value)

  return (
    <Chip
      data-testid={generateTestId(TestId.STATUS, value)}
      label={(translatedValue?.label as string) ?? value}
      color={jobStatusColorMap[value]}
      variant="filled"
    />
  )
}
