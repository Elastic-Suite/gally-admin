import React from 'react'
import {
  IFieldGuesserProps,
  getFieldState,
} from '@elastic-suite/gally-admin-shared'

import EditableFieldGuesser from './EditableFieldGuesser'
import ReadableFieldGuesser from './ReadableFieldGuesser'

function FieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const { editable, ...fieldProps } = props
  const { visible, ...fieldStateProps } = getFieldState(
    fieldProps.data,
    fieldProps.depends
  )

  if (visible === false) return null

  if (editable) {
    return <EditableFieldGuesser {...fieldProps} {...fieldStateProps} />
  }
  return <ReadableFieldGuesser {...fieldProps} {...fieldStateProps} />
}

export default FieldGuesser
