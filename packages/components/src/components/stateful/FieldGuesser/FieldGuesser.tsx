import React from 'react'
import { IFieldGuesserProps } from '@elastic-suite/gally-admin-shared'

import EditableFieldGuesser from './EditableFieldGuesser'
import ReadableFieldGuesser from './ReadableFieldGuesser'

function FieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const { editable, ...fieldProps } = props
  console.log('ok')
  if (editable) {
    return <EditableFieldGuesser {...fieldProps} />
  }
  return <ReadableFieldGuesser {...fieldProps} />
}

export default FieldGuesser
