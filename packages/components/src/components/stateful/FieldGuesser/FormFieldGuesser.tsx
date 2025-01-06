import React from 'react'
import {
  IFieldConfig,
  IFieldGuesserProps,
} from '@elastic-suite/gally-admin-shared'

import FieldGuesser from './FieldGuesser'
import { useValue } from '../../../services'

interface IFormFieldGuesserProps
  extends Omit<IFieldGuesserProps, 'value' | 'id' | 'name' | 'field'> {
  field: IFieldConfig
}

function FormFieldGuesser(props: IFormFieldGuesserProps): JSX.Element {
  const { data, field, ...fieldProps } = props
  const value = useValue(field, data)

  return <FieldGuesser {...field} {...fieldProps} data={data} value={value} />
}

export default FormFieldGuesser
