import React from 'react'
import { styled } from '@mui/system'

import {
  ILimitationsTypes,
  IOptions,
  IRequestType,
  IRequestTypes,
  ITextFieldTagsForm,
} from '@elastic-suite/gally-admin-shared'

const CustomRoot = styled('div')({})

export interface ITextFieldTagssss {
  value: IRequestType
  onChange: (value: IRequestType) => void
  options: IOptions<string>
  limitationsType: ILimitationsTypes[]
}

function TextFieldTagsItem(props: ITextFieldTagssss): JSX.Element {
  const { value, onChange, options, limitationsType } = props

  return <CustomRoot>A</CustomRoot>
}

export default TextFieldTagsItem
